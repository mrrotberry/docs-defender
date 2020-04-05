import React from 'react';

import axios from 'axios';

import { Container, FormGroup, Label, CustomInput, Row, Col, Button } from 'reactstrap';

const Decode = () => {
  const [safeDoc, setSafeDoc] = React.useState('');
  const [notSafeDoc, setNotSafeDoc] = React.useState('');

  return (
    <Container>
      <FormGroup>
        <Label>Upload safe image</Label>
        <CustomInput
          id="doc"
          type="file"
          onChange={event => {
            if (event.target.files && event.target.files[0]) {
              const FR = new FileReader();

              FR.addEventListener('load', function(e) {
                setSafeDoc(e.target.result);
              });

              FR.readAsDataURL(event.target.files[0]);
            }
          }}
        />
      </FormGroup>
      <Row>
        <Col xs={6}>
          {safeDoc ? (
            <>
              <h2>Safe Document</h2>
              <img src={safeDoc} alt="not sage" />
            </>
          ) : null}
        </Col>
        <Col xs={6}>
          {safeDoc ? (
            <>
              <h2>Not safe Document</h2>
              {!notSafeDoc ? (
                <Button
                  onClick={async () => {
                    try {
                      const { data } = await axios({ method: 'post', url: '/api/decode', data: { safeDoc } });

                      setNotSafeDoc(data);
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                >
                  Decode
                </Button>
              ) : (
                <img src={notSafeDoc} alt="Not safe" />
              )}
            </>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default Decode;
