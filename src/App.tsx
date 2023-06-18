import React from "react";
import { Container } from "react-bootstrap";

import MyForm from "./components/MyForm";

const App = () => {
  return (
    <Container className="mx-auto mt-5 p-3 bg-light rounded-3">
      <MyForm />
    </Container>
  );
};

export default App;
