import React from 'react';

import axios from 'axios';

import { Button, Row, Col, CustomInput, Container } from 'reactstrap';

import ImageEditor from '@toast-ui/react-image-editor';

import icona from 'tui-image-editor/dist/svg/icon-a.svg';
import iconb from 'tui-image-editor/dist/svg/icon-b.svg';
import iconc from 'tui-image-editor/dist/svg/icon-c.svg';
import icond from 'tui-image-editor/dist/svg/icon-d.svg';

const myTheme = {
  'menu.backgroundColor': 'white',
  'common.backgroundColor': '#151515',
  'downloadButton.backgroundColor': 'white',
  'downloadButton.borderColor': 'white',
  'downloadButton.color': 'black',
  'menu.normalIcon.path': icond,
  'menu.activeIcon.path': iconb,
  'menu.disabledIcon.path': icona,
  'menu.hoverIcon.path': iconc,
};

const Encode = () => {
  const [notSafeDoc, setNotSafeDoc] = React.useState('');

  const [response, setResponse] = React.useState('');

  const imageEditor = React.createRef();

  const saveImageToDisk = async () => {
    const imageEditorInst = imageEditor.current.imageEditorInst;

    const data = imageEditorInst.toDataURL();

    if (data && notSafeDoc) {
      try {
        const { data: response } = await axios({
          method: 'post',
          url: '/api/encode',
          data: {
            notSafeDoc,
            safeDoc: data,
          },
        });

        setResponse(JSON.stringify(response, null, 2));
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div>
      <ImageEditor
        includeUI={{
          loadImage: {
            path: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            name: 'defended-doc',
          },
          theme: myTheme,
          menu: ['shape'],
          initMenu: 'shape',
          uiSize: {
            height: `calc(100vh - 126px)`,
          },
          menuBarPosition: 'bottom',
        }}
        cssMaxHeight={window.innerHeight}
        cssMaxWidth={window.innerWidth}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        usageStatistics={true}
        ref={imageEditor}
      />
      <Container>
        <div className="text-center" style={{ margin: '1rem 0' }}>
          <Row>
            <Col>
              <CustomInput
                id="doc"
                type="file"
                onChange={event => {
                  if (event.target.files && event.target.files[0]) {
                    const FR = new FileReader();

                    FR.addEventListener('load', function(e) {
                      setNotSafeDoc(e.target.result);
                    });

                    FR.readAsDataURL(event.target.files[0]);

                    const imageEditorInst = imageEditor.current.imageEditorInst;

                    imageEditorInst.loadImageFromFile(event.target.files[0]);
                  }
                }}
              />
            </Col>
            <Col>
              {!response ? (
                <Button disabled={!notSafeDoc && !response} onClick={saveImageToDisk}>
                  Upload image
                </Button>
              ) : null}

              {response ? (
                <Button tag="a" download href="/docs/safe-doc.png">
                  Download safe image
                </Button>
              ) : null}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Encode;
