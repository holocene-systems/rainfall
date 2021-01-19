
import React from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Badge
} from 'react-bootstrap'

import Select from 'react-select';

// icons
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCalendar, faList } from '@fortawesome/free-solid-svg-icons'

import {
  selectMapStyleSourceDataFeatures,
  selectPixelLookupsBasinsOnly,
  selectPickedSensors,
  selectContext
} from '../../store/selectors'
import {
  pickSensor
} from '../../store/actions'
import {
  pluralize
} from '../../store/utils/index'

import { CONTEXT_TYPES } from '../../store/config'


class GeodataPicker extends React.Component {
  constructor(props) {
    super();

    this.handleOnApply = this.handleOnApply.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    }

  }

  handleSelectGauge = selectedGauges => {
    this.props.dispatchPickSensorParam({
      sensorLocationType: "gauge",
      selectedOptions: selectedGauges // this is a list
    })
  };

  handleSelectBasin = selectedBasin => {
    this.props.dispatchPickSensorParam({
      sensorLocationType: "basin",
      selectedOptions: selectedBasin !== null ? [selectedBasin] : null // make this a list
    })
  };

  handleOnApply() {
    return;
  }

  handleClose(e) {
    this.setState({ show: false });
  }

  handleShow(e) {
    this.setState({ show: true });
  }

  render() {
    // const { selectedGauges, selectedBasin } = this.state;
    let gaugeCount = this.props.gaugeCount
    let pixelCount = this.props.pixelCount
    return (
      <div>
        <Row noGutters>
          <Col>
            <strong>Where</strong>
          </Col>
        </Row>

        {(this.props.context !== CONTEXT_TYPES.legacyGarr) ? (
        <Row noGutters>
          <Col md={2}>
            <small>Rain Gauges</small>
          </Col>
          <Col md={8}>
            <Select
              isMulti
              value={this.props.selectedGauges}
              onChange={this.handleSelectGauge}
              options={this.props.raingaugeOpts}
              menuPortalTarget={document.body}
              isClearable
            />
          </Col>
          <Col md={2}>
            {(gaugeCount > 0) ? (
              <span className="mx-1 my-1"><Badge pill variant="primary">
                {`${gaugeCount} ${pluralize(gaugeCount, 'gauge', 'gauges')}`}
              </Badge>
              </span>
            ) : (
              null
            )}
          </Col>
        </Row>
        ):(
          null
        )}

      {(this.props.context !== CONTEXT_TYPES.legacyGauge) ? (
        <Row noGutters>
          <Col md={2}>
            <small>Radar Pixels</small>
          </Col>
          <Col md={8}>
            <Select
              value={this.props.selectedBasin}
              onChange={this.handleSelectBasin}
              options={this.props.basinOpts}
              menuPortalTarget={document.body}
              isClearable
            />
          </Col>
          <Col md={2}>
          {(pixelCount > 0) ? (
              <span className="mx-1 my-1"><Badge pill variant="primary">
                {`${pixelCount} ${pluralize(pixelCount, 'pixel', 'pixels')}`}
              </Badge>
              </span>
            ) : (
              null
            )}
          </Col>          
        </Row>
        ):(
          null
        )}

      </div>

    );
  }
}

function mapStateToProps(state, ownProps) {
  var selectedPixels = selectPickedSensors(state, ownProps.contextType, 'pixel')
  var selectedRainGauges = selectPickedSensors(state, ownProps.contextType, 'gauge')

  return {
    raingaugeOpts: selectMapStyleSourceDataFeatures(state, 'gauge')
      .map(i => ({ value: i.id, label: `${i.id}: ${i.properties.name}` })),
    basinOpts: selectPixelLookupsBasinsOnly(state)
      .map(i => ({ value: i.value, label: i.value })),
    selectedBasin: selectPickedSensors(state, ownProps.contextType, 'basin'),
    selectedRaingauges: selectedPixels,
    selectedPixels: selectedPixels,
    pixelCount: selectedPixels.length,
    gaugeCount: selectedRainGauges.length,
    context: selectContext(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchPickSensorParam: payload => {
      dispatch(pickSensor({...payload, contextType: ownProps.contextType}))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GeodataPicker);