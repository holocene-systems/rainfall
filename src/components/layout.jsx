import React from 'react';
import { connect } from 'react-redux';
import {Row, Col, Container, Tabs, Tab} from 'react-bootstrap';

import ReactMap from './map/map';
import RainfallDownloader from './sidebar/downloader'
import ThinkingOverlay from './thinking/thinkingOverlay'

import { RAINFALL_TYPES } from '../store/config'

import './layout.scss'

/**
* Layout Component. Everything on the page under the Nav: Controls and Map.
*/
class Layout extends React.Component {
  render() {

    return (
    
      <div className="fill no-gutters">

        <ThinkingOverlay/>

        <Row>
          <Col>
            {/* <ProgressBar /> */}
          </Col>
        </Row>

        <Row className="fill no-gutters">
          <Col sm={5} className="scrolling-column">
            <Container className="sidebar">
            <Tabs 
              defaultActiveKey="tab-historic" 
              id="rainfall-data-type-tabs" 
              mountOnEnter={true}
            >
              <Tab eventKey="tab-realtime" title="Real-Time (raw)" disabled>
                <RainfallDownloader rainfallDataType={RAINFALL_TYPES.realtime}/>
              </Tab>
              <Tab eventKey="tab-historic" title="Historic (calibrated)" >
                <br></br>
                <RainfallDownloader rainfallDataType={RAINFALL_TYPES.historic}/>
              </Tab>
            </Tabs>
            </Container>         
            {/* <Container>
              <Row>
                <Col>
                  <h4>Events</h4>
                </Col>
                <Col>
                  <EventFilterControls/>
                </Col>                
              </Row>
              <EventsList />
            </Container> */}
          </Col>
          
          <Col sm={7} className="map-column">
            <ReactMap
              token={this.props.token}
              styleUrl={this.props.styleId}
              latitude={this.props.latitude}
              longitude={this.props.longitude}
              zoom={this.props.zoom}
            />
          </Col>
        </Row>
      </div>
      // </Container>
    )
  }
}

function mapStateToProps(state) {
  return { ...state.initMap }
}

export default connect(mapStateToProps)(Layout);