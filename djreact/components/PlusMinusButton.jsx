import React from "react"

export default class PlusMinusButton extends React.Component {
  render() {
    return (
		<span onClick={this.props.onClick} style={{fontSize:'16px'}} className={'btn btn-xs btn-info'}>
			<i className={this.props.show_hide ? 'glyphicon glyphicon-plus-sign' : 'glyphicon glyphicon-minus-sign'}></i>
		</span>
    );
  }
}