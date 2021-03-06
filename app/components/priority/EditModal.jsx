import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { SketchPicker } from 'react-color';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  } else if (props.data.name !== values.name && _.findIndex(props.collection || [], { name: values.name }) !== -1) {
    errors.name = '该名称已存在';
  }

  if (values.color) {
    const pattern = new RegExp(/^#[0-9a-fA-F]{6}$/);
    if (!pattern.test(values.color))
    {
      errors.color = '格式错误';
    }
  }

  return errors;
};

@reduxForm({
  form: 'priority',
  fields: ['id', 'name', 'color', 'description'],
  validate
})
export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, displayColorPicker: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    dirty: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    initializeForm(data);
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('更新完成。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  handlerHideColorPicker() {
    if (!this.state.displayColorPicker) return;
    this.setState({ displayColorPicker: false });
  }

  handlerShowColorPicker(e) {
    e.stopPropagation();
    if (this.state.displayColorPicker) return;
    this.setState({ displayColorPicker: true });
  }

  render() {
    const { i18n: { errMsg }, fields: { id, name, color, description }, handleSubmit, invalid, dirty, submitting, data } = this.props;

    let colorStyle = { backgroundColor: '#cccccc', marginTop: '10px', marginRight: '8px' };
    if (color.value)
    {
      colorStyle = { backgroundColor: color.value, marginTop: '10px', marginRight: '8px' };
    }

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton onClick={ this.handlerHideColorPicker.bind(this) } style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '编辑优先级 - ' + data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body onClick={ this.handlerHideColorPicker.bind(this) }>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>名称</ControlLabel>
            <FormControl type='hidden' { ...id }/>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='优先级名'/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ color.touched && color.error ? 'error' : '' }>
            <ControlLabel>图案颜色</ControlLabel>
            <FormControl disabled={ submitting } onClick={ this.handlerShowColorPicker.bind(this) } type='text' { ...color } placeholder='#cccccc'/>
            <FormControl.Feedback>
              <span className='circle' style={ colorStyle }/>
            </FormControl.Feedback>
            { color.touched && color.error && <HelpBlock style={ { float: 'right' } }>{ color.error }</HelpBlock> }
            { this.state.displayColorPicker &&
              <div
                onClick={ (e)=>{ e.stopPropagation(); } }
                style={ { display: 'inline-block' } } >
                <SketchPicker
                  color={ color.value || '#cccccc' }
                  onChange={ (pickedColor) => { color.onChange(pickedColor.hex) } } />
              </div> }
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>描述</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...description } placeholder='描述'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer onClick={ this.handlerHideColorPicker.bind(this) }>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ !dirty || submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
