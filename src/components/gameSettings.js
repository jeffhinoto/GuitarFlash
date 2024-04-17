import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const GameSettings = ({ setSpeed, setShowSettings }) => {
  const [speedInput, setSpeedInput] = useState(50);

  const handleChange = (event) => {
    setSpeedInput(Number(event.target.value));
  };

  const handleSave = () => {
    setSpeed(speedInput);
    setShowSettings(false);
  };

  const handleCancel = () => {
    setShowSettings(false);
  };

  return (
    <SettingsContainer>
      <Title>Game Settings</Title>
      <FormGroup>
        <Label htmlFor="speed">Speed:</Label>
        <Input
          type="number"
          id="speed"
          name="speed"
          min="1"
          max="100"
          value={speedInput}
          onChange={handleChange}
        />
      </FormGroup>
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
        Cancel
      </Button>
    </SettingsContainer>
  );
};

export default GameSettings;
