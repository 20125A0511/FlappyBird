class GeneticAlgorithm {
    constructor(populationSize, mutationRate) {
        this.populationSize = populationSize;
        this.mutationRate = mutationRate;
        this.generation = 1;
        this.bestScore = 0;
        this.bestBird = null;
    }

    // Calculate fitness based on score and survival time
    calculateFitness(birds) {
        let sum = 0;
        
        // Find the best score and calculate fitness
        for (let bird of birds) {
            // Fitness is a combination of score and distance traveled
            bird.fitness = bird.score * 1000 + bird.distance;
            
            if (bird.score > this.bestScore) {
                this.bestScore = bird.score;
                this.bestBird = bird.brain.copy();
            }
            sum += bird.fitness;
        }

        // Normalize fitness
        for (let bird of birds) {
            if (sum > 0) {
                bird.fitness = bird.fitness / sum;
            } else {
                bird.fitness = 0.01;
            }
        }
        
        // Sort birds by fitness for better parent selection
        birds.sort((a, b) => b.fitness - a.fitness);
    }

    // Select parent based on fitness (roulette wheel selection)
    selectParent(birds) {
        let index = 0;
        let r = Math.random();

        while (r > 0) {
            r -= birds[index].fitness;
            index++;
        }
        index--;

        return birds[index];
    }

    // Create next generation
    nextGeneration(birds) {
        this.calculateFitness(birds);
        
        let newBirds = [];

        // Keep the top 10% performers (elitism)
        let eliteCount = Math.floor(this.populationSize * 0.1);
        for (let i = 0; i < eliteCount && i < birds.length; i++) {
            if (birds[i].score > 0) {
                let eliteBird = new Bird();
                eliteBird.brain = birds[i].brain.copy();
                newBirds.push(eliteBird);
            }
        }

        // Always keep the best bird
        if (this.bestBird && newBirds.length === 0) {
            let eliteBird = new Bird();
            eliteBird.brain = this.bestBird.copy();
            newBirds.push(eliteBird);
        }

        // Fill the rest with crossover and mutation
        while (newBirds.length < this.populationSize) {
            let parent1 = this.selectParent(birds);
            let parent2 = this.selectParent(birds);
            
            let child = this.crossover(parent1, parent2);
            child.brain.mutate(this.mutationRate);
            newBirds.push(child);
        }

        this.generation++;
        return newBirds;
    }

    // Crossover between two parents (optional enhancement)
    crossover(parent1, parent2) {
        let child = new Bird();
        child.brain = parent1.brain.copy();

        // Mix weights from both parents
        for (let i = 0; i < child.brain.weightsIH.length; i++) {
            for (let j = 0; j < child.brain.weightsIH[i].length; j++) {
                if (Math.random() < 0.5) {
                    child.brain.weightsIH[i][j] = parent2.brain.weightsIH[i][j];
                }
            }
        }

        for (let i = 0; i < child.brain.weightsHO.length; i++) {
            for (let j = 0; j < child.brain.weightsHO[i].length; j++) {
                if (Math.random() < 0.5) {
                    child.brain.weightsHO[i][j] = parent2.brain.weightsHO[i][j];
                }
            }
        }

        return child;
    }

    // Alternative next generation with crossover
    nextGenerationWithCrossover(birds) {
        this.calculateFitness(birds);
        
        let newBirds = [];

        // Always keep the best bird (elitism)
        if (this.bestBird) {
            let eliteBird = new Bird();
            eliteBird.brain = this.bestBird.copy();
            newBirds.push(eliteBird);
        }

        // Fill the rest of the population with crossover and mutation
        while (newBirds.length < this.populationSize) {
            let parent1 = this.selectParent(birds);
            let parent2 = this.selectParent(birds);
            
            let child = this.crossover(parent1, parent2);
            child.brain.mutate(this.mutationRate);
            newBirds.push(child);
        }

        this.generation++;
        return newBirds;
    }
}
