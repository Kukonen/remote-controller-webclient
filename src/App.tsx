import React from 'react'
import './App.css'
import {
    Box,
    Heading,
    Text
} from "@chakra-ui/react";

function App() {

  return (
      <Box p={6}>
          <Heading mb={4}>Система управления станками.</Heading>

          <Text>Выберете удобный вам раздел в верхней части экрана</Text>
      </Box>
  )
}

export default App
