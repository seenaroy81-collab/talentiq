/**
 * Simple Regression Utility for Gaze Mapping
 * Implements Least Squares fitting for Polynomial Regression
 */
class Regression {
    /**
     * Fit a polynomial regression model
     * @param {Array} data - Array of [x, y] points
     * @param {number} order - Order of polynomial (1=linear, 2=quadratic)
     * @returns {Object} Model with predict() method
     */
    static polynomial(data, order = 2) {
        // Prepare matrices for Normal Equation: (X^T * X)^-1 * X^T * Y
        const lhs = [];
        const rhs = [];
        const a = [];
        const b = [];
        const len = data.length;
        const k = order + 1;

        for (let i = 0; i < k; i++) {
            for (let l = 0; l < len; l++) {
                if (data[l][1] !== null) { // valid y
                    a[i] = (a[i] || 0) + Math.pow(data[l][0], i);
                    b[i] = (b[i] || 0) + Math.pow(data[l][0], i) * data[l][1];
                }
            }
        }

        // This is a simplified 1D polynomial fit. 
        // For Gaze (Screen X vs Eye X/Y + Head), we need Multivariate Regression.
        // Let's implement Multiple Linear Regression instead for (EyeX, EyeY, HeadYaw, HeadPitch) -> ScreenX
    }

    /**
     * Multiple Linear Regression
     * Predict Y based on multiple X variables: Y = b0 + b1*x1 + b2*x2 + ...
     * Uses Normal Equation: beta = (X^T * X)^-1 * X^T * Y
     * where X is matrix of inputs (rows=samples, cols=features+1 bias), Y is target vector
     */
    static multipleLinear(inputs, targets) {
        // inputs: Array of arrays (features)
        // targets: Array of numbers

        try {
            const n = inputs.length;
            if (n === 0) return null;
            const p = inputs[0].length; // num features

            // Add bias term (1) to inputs
            const X = inputs.map(row => [1, ...row]);
            const Y = targets;

            // Compute (X^T * X)
            const Xt = this.transpose(X);
            const XtX = this.multiply(Xt, X);

            // Compute inverse (XtX)^-1
            // For simple implementation, we assume matrix is invertible (Gaussian elimination)
            const XtX_inv = this.invert(XtX);
            if (!XtX_inv) return null; // Singular matrix

            // Compute Xt * Y
            const XtY = this.multiplyVector(Xt, Y);

            // Compute beta = XtX_inv * XtY
            const beta = this.multiplyVector(XtX_inv, XtY);

            return {
                weights: beta,
                predict: (features) => {
                    let sum = beta[0]; // bias
                    for (let i = 0; i < features.length; i++) {
                        sum += beta[i + 1] * features[i];
                    }
                    return sum;
                }
            };
        } catch (e) {
            console.error("Regression failed:", e);
            // Fallback: simple average
            const avg = targets.reduce((a, b) => a + b, 0) / targets.length;
            return {
                weights: [],
                predict: () => avg
            };
        }
    }

    // Matrix helpers
    static transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    static multiply(A, B) {
        const result = Array(A.length).fill(0).map(() => Array(B[0].length).fill(0));
        return result.map((row, i) => {
            return row.map((val, j) => {
                return A[i].reduce((sum, elm, k) => sum + (elm * B[k][j]), 0);
            });
        });
    }

    static multiplyVector(A, v) {
        return A.map(row => row.reduce((sum, elm, k) => sum + (elm * v[k]), 0));
    }

    static invert(M) {
        // Gaussian elimination for matrix inversion
        // Simplified for small matrices (4x4 or 5x5)
        const dim = M.length;
        const I = [];
        const C = JSON.parse(JSON.stringify(M)); // Clone

        for (let i = 0; i < dim; i++) {
            I[i] = [];
            for (let j = 0; j < dim; j++) I[i][j] = (i === j) ? 1 : 0;
        }

        for (let i = 0; i < dim; i++) {
            let e = C[i][i];
            if (Math.abs(e) < 1e-8) return null; // Singular

            for (let j = 0; j < dim; j++) {
                C[i][j] /= e;
                I[i][j] /= e;
            }

            for (let ii = 0; ii < dim; ii++) {
                if (ii !== i) {
                    let elm = C[ii][i];
                    for (let j = 0; j < dim; j++) {
                        C[ii][j] -= elm * C[i][j];
                        I[ii][j] -= elm * I[i][j];
                    }
                }
            }
        }
        return I;
    }
}

export default Regression;
