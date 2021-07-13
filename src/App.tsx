import React, {useEffect, useState} from 'react';
import {Button, Table, Spinner, Navbar} from 'react-bootstrap';
import ScrollableFeed from 'react-scrollable-feed';
import axios from 'axios';
import './App.scss';
import CustomModal from "./CustomModal";
import { banksInfoPath } from './routes';

const DELAY = 5000;
type Items = object[];

const App = () => {
  const [fetched, setFetched] = useState<Items>([]);
  const [isOpenedModal, switchModal] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const fetchContent = async () => {
    try {
      const { data } = await axios.get(banksInfoPath());
      setFetched(data);
      setLoading(false);
    } catch {
        console.log('Network Error. Try refresh page.');
    }
  };

  useEffect(() => {
    fetchContent();
    setInterval(fetchContent, DELAY);

    return () => {
      setLoading(false);
    }
  }, []);

  const handleModal = () => {
    switchModal(!isOpenedModal);
  };

  const renderModal = (isOpenedModalFlag: boolean, handleModalFn: object, fetchedItems: object[], onSubmit: object) => <CustomModal show={isOpenedModal} onHide={handleModal} fetched={fetched} onSubmit={fetchContent}/>;

  return (
    <>
      {isLoading
        ? (
          <div className="d-flex flex-column h-100">
            <div className="h-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          </div>
        )
        :  (
          <div className="d-flex flex-column h-100">
            <div className="container flex-grow-1 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white">
                <div className="col p-0 h-100">
                  <div className="d-flex flex-column h-100">
                    <ScrollableFeed forceScroll>
                      <div className="overflow-auto px-5">
                        <Navbar bg="light" expand="lg">
                          <Navbar.Brand href="/">The Simplest Database</Navbar.Brand>
                        </Navbar>
                        {/*<h1 className="shadow bg-secondary text-center text-white">Simple Database</h1>*/}
                        <Table striped bordered hover variant="dark">
                          <thead>
                          <tr>
                            {
                              fetched.length > 0 && Object.keys(fetched[0])
                                .map((key) => <th key={key}>{key}</th>)
                            }
                          </tr>
                          </thead>
                          <tbody>
                          {
                            fetched.length > 0 && fetched.map((item, i) => (
                              <tr key={i}>
                                {
                                  Object.values(item)
                                    .map((value) => <td key={value}>{value}</td>)
                                }
                              </tr>
                            ))
                          }
                          </tbody>
                        </Table>
                        {/*<div className="border-top mt-auto py-3 px-5">*/}
                        {/*  <Button*/}
                        {/*    variant="secondary"*/}
                        {/*    size="lg"*/}
                        {/*    className="btn-block"*/}
                        {/*    onClick={handleModal}*/}
                        {/*  >*/}
                        {/*    Add New Entry*/}
                        {/*  </Button>*/}
                        {/*</div>*/}
                        {
                          isOpenedModal
                            ? renderModal(isOpenedModal, handleModal, fetched, fetchContent)
                            : null
                        }
                      </div>
                    </ScrollableFeed>
                    <div className="border-top mt-auto py-3 px-5">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="btn-block"
                        onClick={handleModal}
                      >
                        Add New Entry
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default App;
