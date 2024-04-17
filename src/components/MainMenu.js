import React, { useState } from 'react';
import GameSettings from './gameSettings'; // Importe o componente GameSettings
import Game from './Game'; // Importe o componente Game aqui

const MainMenu = () => {
  const [showSettings, setShowSettings] = useState(false); // Estado para controlar a exibição das configurações
  const [speed, setSpeed] = useState(50); // Estado para armazenar a velocidade do jogo

  // Função para alternar entre a exibição do menu de configurações e o jogo
  const handlePlay = () => {
    setShowSettings(false);
  };

  // Função para alternar entre a exibição do jogo e o menu de configurações
  const handleSettings = () => {
    setShowSettings(true);
  };

  return (
    <div>
      <h1>Main Menu</h1>
      {/* Renderiza o botão para acessar as configurações */}
      <button onClick={handleSettings}>Settings</button>
      {/* Renderiza o botão para jogar */}
      <button onClick={handlePlay}>Play</button>
      {/* Renderiza o componente Game ou GameSettings com base no estado showSettings */}
      {showSettings ? (
        <GameSettings setSpeed={setSpeed} />
      ) : (
        <Game speed={speed} />
      )}
    </div>
  );
};

export default MainMenu;
