class NeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        // Initialize weights and biases with random values
        this.weightsIH = this.createMatrix(this.hiddenNodes, this.inputNodes);
        this.weightsHO = this.createMatrix(this.outputNodes, this.hiddenNodes);
        this.biasH = this.createMatrix(this.hiddenNodes, 1);
        this.biasO = this.createMatrix(this.outputNodes, 1);

        this.randomizeMatrix(this.weightsIH);
        this.randomizeMatrix(this.weightsHO);
        this.randomizeMatrix(this.biasH);
        this.randomizeMatrix(this.biasO);
    }

    createMatrix(rows, cols) {
        let matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = 0;
            }
        }
        return matrix;
    }

    randomizeMatrix(matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                matrix[i][j] = Math.random() * 2 - 1; // Random value between -1 and 1
            }
        }
    }

    // Activation function (sigmoid)
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    // Tanh activation function (better for hidden layers)
    tanh(x) {
        return Math.tanh(x);
    }
    
    // ReLU activation function
    relu(x) {
        return Math.max(0, x);
    }

    // Matrix multiplication
    matrixMultiply(a, b) {
        if (a[0].length !== b.length) {
            console.error('Matrix dimensions do not match for multiplication');
            return null;
        }

        let result = this.createMatrix(a.length, b[0].length);
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < a[0].length; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    // Matrix addition
    matrixAdd(a, b) {
        let result = this.createMatrix(a.length, a[0].length);
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a[i].length; j++) {
                result[i][j] = a[i][j] + b[i][j];
            }
        }
        return result;
    }

    // Apply activation function to matrix
    matrixMap(matrix, func) {
        let result = this.createMatrix(matrix.length, matrix[0].length);
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                result[i][j] = func(matrix[i][j]);
            }
        }
        return result;
    }

    // Feed forward algorithm
    feedForward(inputArray) {
        // Convert input array to matrix
        let inputs = this.createMatrix(inputArray.length, 1);
        for (let i = 0; i < inputArray.length; i++) {
            inputs[i][0] = inputArray[i];
        }

        // Calculate hidden layer with tanh activation
        let hidden = this.matrixMultiply(this.weightsIH, inputs);
        hidden = this.matrixAdd(hidden, this.biasH);
        hidden = this.matrixMap(hidden, this.tanh);

        // Calculate output layer with sigmoid activation
        let output = this.matrixMultiply(this.weightsHO, hidden);
        output = this.matrixAdd(output, this.biasO);
        output = this.matrixMap(output, this.sigmoid);

        // Convert output matrix to array
        let outputArray = [];
        for (let i = 0; i < output.length; i++) {
            outputArray[i] = output[i][0];
        }

        return outputArray;
    }

    // Create a copy of the neural network
    copy() {
        let nn = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);
        
        // Deep copy weights and biases
        for (let i = 0; i < this.weightsIH.length; i++) {
            for (let j = 0; j < this.weightsIH[i].length; j++) {
                nn.weightsIH[i][j] = this.weightsIH[i][j];
            }
        }
        
        for (let i = 0; i < this.weightsHO.length; i++) {
            for (let j = 0; j < this.weightsHO[i].length; j++) {
                nn.weightsHO[i][j] = this.weightsHO[i][j];
            }
        }
        
        for (let i = 0; i < this.biasH.length; i++) {
            nn.biasH[i][0] = this.biasH[i][0];
        }
        
        for (let i = 0; i < this.biasO.length; i++) {
            nn.biasO[i][0] = this.biasO[i][0];
        }
        
        return nn;
    }

    // Mutate the neural network for genetic algorithm
    mutate(mutationRate) {
        this.mutateMatrix(this.weightsIH, mutationRate);
        this.mutateMatrix(this.weightsHO, mutationRate);
        this.mutateMatrix(this.biasH, mutationRate);
        this.mutateMatrix(this.biasO, mutationRate);
    }

    mutateMatrix(matrix, mutationRate) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (Math.random() < mutationRate) {
                    let offset = (Math.random() * 2 - 1) * 0.5;
                    matrix[i][j] += offset;
                }
            }
        }
    }
}
