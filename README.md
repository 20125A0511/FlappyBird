# Self-Learning Flappy Bird 🐦

A browser-based Flappy Bird game where AI birds learn to play through neural networks and genetic algorithms.

## Features

- **Neural Network Brain**: Each bird has a neural network with:
  - 7 input neurons (bird position, velocity, pipe positions, distances)
  - 16 hidden neurons with tanh activation
  - 1 output neuron (jump/no jump decision)

- **Genetic Algorithm Evolution**:
  - Population of 50 birds per generation
  - Fitness based on score and survival distance
  - Elite selection (top 10% preserved)
  - Crossover breeding between successful birds
  - 8% mutation rate for diversity

- **Modern UI**:
  - Glassmorphism design
  - Real-time statistics display
  - Speed controls (1x, 2x, 5x, 10x)
  - Pause/Resume functionality
  - Start screen with instructions

## How to Run

1. Clone the repository:
```bash
git clone https://github.com/20125A0511/FlappyBird.git
cd FlappyBird
```

2. Start the local server:
```bash
python3 server.py
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## How It Works

1. **Initial Generation**: Birds start with random neural networks
2. **Observation**: Each bird observes:
   - Its own position and velocity
   - Distance to the next pipe
   - Gap position of the next pipe
   - Relative position to the gap center
3. **Decision Making**: Neural network processes inputs and decides whether to jump
4. **Evolution**: After all birds die:
   - Fitness is calculated based on score and distance
   - Best performers are selected for breeding
   - New generation is created through crossover and mutation

## Controls

- **Start Game**: Click the "Start Game" button
- **Pause/Resume**: Toggle game pause
- **Speed**: Adjust simulation speed for faster training
- **Reset**: Start fresh with new random population

## Learning Progress

- **Generation 1-5**: Birds crash quickly, learning basic flight
- **Generation 5-15**: Birds start avoiding pipes occasionally
- **Generation 15-30**: Consistent pipe navigation emerges
- **Generation 30+**: Optimized flight patterns develop

## Technologies Used

- HTML5 Canvas for rendering
- Vanilla JavaScript for game logic
- Neural Networks for decision making
- Genetic Algorithm for evolution
- CSS3 with glassmorphism effects

## Game Parameters

- Population size: 50 birds
- Gap height: 180px
- Pipe spacing: 120 frames
- Mutation rate: 8%
- Elite selection: 10%

## Contributing

Feel free to fork this repository and submit pull requests for improvements!

## License

This project is open source and available under the MIT License.
