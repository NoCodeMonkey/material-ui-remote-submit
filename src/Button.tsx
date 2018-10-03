import { Button as MuiButton, Omit, Tooltip } from '@material-ui/core';
import { ButtonProps as MuiButtonProps } from '@material-ui/core/Button';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import * as classNames from 'classnames';
import * as React from 'react';

export interface ButtonProps extends Omit<MuiButtonProps, 'component'> {
  tooltip?: string;
}

const styles = () => (createStyles({
  fullWidth: {
    width: '100%'
  },
  root: {
    display: 'flex',
    margin: `0px !important`
  }
}));

export type ButtonPropTypes = ButtonProps & WithStyles<typeof styles>;

class Button extends React.Component<ButtonPropTypes, {}> {
  constructor(props: ButtonPropTypes) {
    super(props);
  }

  public renderButton = () => {
    const {
      classes,
      ...rest
    } = this.props;
    return (
      <span className={classNames(classes.root, this.props.fullWidth && classes.fullWidth)}>
        <MuiButton {...rest} />
      </span>
    );
  }
  public render() {
    const { tooltip } = this.props;
    if (tooltip) {
      return (
        <Tooltip
          enterDelay={300}
          id={tooltip}
          leaveDelay={100}
          title={tooltip}
        >
          {this.renderButton()}
        </Tooltip>
      );
    }
    return this.renderButton();
  }
}

export default withStyles(styles)(Button);