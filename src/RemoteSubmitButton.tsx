import { CircularProgress } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Check as IconCheck, Error as IconError, Save as IconSave } from '@material-ui/icons';
import * as classNames from 'classnames';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { compose, Dispatch } from 'redux';
import {
  clearSubmitErrors,
  getFormError,
  hasSubmitFailed,
  hasSubmitSucceeded,
  isInvalid,
  isPristine,
  isSubmitting,
  reset,
  submit
} from 'redux-form';
import { ButtonProps, default as Button } from './Button';

export interface RemoteSubmitButtonStateProps {
  error?: any;
  invalid?: boolean;
  pristine?: boolean;
  submitFailed?: boolean;
  submitSucceeded?: boolean;
  submitting: boolean;
}

export interface RemoteSubmitButtonDispatchProps {
  submitForm(): void;
  resetForm(): void;
  clearFormSubmitErrors(): void;
}

export interface RemoteSubmitButtonProps extends ButtonProps {
  formName: string;
  isClearSubmitErrors?: boolean;
  isReset?: boolean;
  resetDuration?: number;
}

export interface RemoteSubmitButtonState {
  isError: boolean;
  isSuccess: boolean;
  timeoutId?: number;
}

const styles = ({palette, shadows, spacing}: Theme) => (createStyles({
  fullWidth: {
    flex: '1 1 auto',
  },
  iconSmall: {
    fontSize: 20,
  },
  isErrorContained: {
    '&:disabled': {
      '&:hover': {
        backgroundColor: palette.error.dark,
      },
      backgroundColor: palette.error.main,
      boxShadow: shadows[2],
      color: palette.common.white,
    }
  },
  isErrorText: {
    '&:disabled': {
      '&:hover': {
        color: palette.error.dark
      },
      color: palette.error.main,
    }
  },
  isSubmittingContained: {
    '&:disabled': {
      '& svg': {
        color: palette.common.white
      },
      '&:hover': {
        backgroundColor: palette.primary.dark
      },
      backgroundColor: palette.primary.main,
      boxShadow: shadows[2]
    }
  },
  isSuccessContained: {
    '&:disabled': {
      '&:hover': {
        backgroundColor: green[700]
      },
      backgroundColor: green[500],
      boxShadow: shadows[2],
      color: palette.common.white
    }
  },
  isSuccessText: {
    '&:disabled': {
      '&:hover': {
        color: green[700]
      },
      color: green[500]
    }
  },
  leftIcon: {
    marginRight: spacing.unit,
  },
  root: {
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  }
}));

export type RemoteSubmitButtonPropTypes = RemoteSubmitButtonProps & RemoteSubmitButtonStateProps &
  RemoteSubmitButtonDispatchProps & WithStyles<typeof styles>;

const mapStateToProps: MapStateToProps<RemoteSubmitButtonStateProps, RemoteSubmitButtonProps, any> =
  (state: any, ownProps: RemoteSubmitButtonProps) => {
    return {
      error: getFormError(ownProps.formName)(state),
      invalid: isInvalid(ownProps.formName)(state),
      pristine: isPristine(ownProps.formName)(state),
      submitFailed: hasSubmitFailed(ownProps.formName)(state),
      submitSucceeded: hasSubmitSucceeded(ownProps.formName)(state),
      submitting: isSubmitting(ownProps.formName)(state)
    };
  };

const mapDispatchToProps: MapDispatchToPropsFunction<RemoteSubmitButtonDispatchProps, RemoteSubmitButtonProps> =
  (dispatch: Dispatch, ownProps: RemoteSubmitButtonProps) => {
  return {
    clearFormSubmitErrors: () => {
      dispatch(clearSubmitErrors(ownProps.formName));
    },
    resetForm: () => {
      dispatch(reset(ownProps.formName));
    },
    submitForm: () => {
      dispatch(submit(ownProps.formName));
    }
  };
};

class RemoteSubmitButton extends React.Component<RemoteSubmitButtonPropTypes, RemoteSubmitButtonState> {
  public static defaultProps = {
    resetDuration: 6000
  };

  constructor(props: RemoteSubmitButtonPropTypes) {
    super(props);

    this.handleState = this.handleState.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      isError: false,
      isSuccess: false,
      timeoutId: undefined
    };
  }

  public handleState = (StateObj: any, fn?: () => void) => {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }
    const timeoutId = setTimeout(() => {
      clearTimeout(this.state.timeoutId);
      if (fn) {
        fn();
      }
      this.setState({
        isError: false,
        isSuccess: false,
        timeoutId: undefined
      });
    },                           this.props.resetDuration);
    return this.setState({
      ...StateObj,
      timeoutId
    });
  }

  public handleClear = () => {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }
    return this.setState({ isError: false, isSuccess: false, timeoutId: undefined });
  }

  public onSubmit = (event: React.FormEvent<HTMLElement>) => {
    const {
      submitForm
    } = this.props;

    submitForm();
  }

  public componentDidUpdate(prevProps: RemoteSubmitButtonPropTypes) {
    const {
      clearFormSubmitErrors,
      error,
      isClearSubmitErrors,
      isReset,
      resetForm,
      submitSucceeded,
    } = this.props;
    switch (true) {
      case ((error !== prevProps.error && error === undefined) || (submitSucceeded !== prevProps.submitSucceeded && !submitSucceeded)): {
        return this.handleClear();
      }
      case (submitSucceeded !== prevProps.submitSucceeded && submitSucceeded): {
        return this.handleState({
          isError: false,
          isSuccess: true
        },                      isReset ? () => resetForm() : undefined);
      }
      case (error !== prevProps.error && error !== undefined): {
        return this.handleState({
          isError: true,
          isSuccess: false
        },                      isClearSubmitErrors ? () => clearFormSubmitErrors() : undefined);
      }
      default:
        return;
    }
  }

  public renderChildren = () => {
    const { children, classes, submitting, pristine, invalid, submitFailed } = this.props;
    const { isError, isSuccess } = this.state;
    if (isError || (submitFailed && !pristine && invalid)) {
      return (children) ? <React.Fragment><IconError className={classNames(classes.leftIcon, classes.iconSmall)} />{children}</React.Fragment>
        : <IconError />;
    }
    if (isSuccess) {
      return (children) ? <React.Fragment><IconCheck className={classNames(classes.leftIcon, classes.iconSmall)} />{children}</React.Fragment>
        : <IconCheck />;
    }
    if (submitting) {
      return (children) ? <React.Fragment><CircularProgress size={20} className={classes.leftIcon} />{children}</React.Fragment>
        : <CircularProgress size={20} />;
    }
    return (children) ? <React.Fragment><IconSave className={classNames(classes.leftIcon, classes.iconSmall)} />{children}</React.Fragment>
      : <IconSave />;
  }

  public renderClassName = () => {
    const { classes, variant, submitting, pristine, invalid, submitFailed } = this.props;
    const { isError, isSuccess } = this.state;
    if (variant === 'contained' || variant === 'fab' || variant === 'raised') {
      if (isError || (submitFailed && !pristine && invalid)) { return classes.isErrorContained; }
      if (isSuccess) { return classes.isSuccessContained; }
      if (submitting) { return classes.isSubmittingContained; }
      return null;
    }
    if (isError || (submitFailed && !pristine && invalid)) { return classes.isErrorText; }
    if (isSuccess) { return classes.isSuccessText; }
    return null;
  }

  public componentWillUnmount() {
    const { timeoutId } = this.state;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  public render() {
    const {
      children,
      className,
      classes,
      clearFormSubmitErrors,
      formName,
      invalid,
      isClearSubmitErrors,
      isReset,
      pristine,
      resetForm,
      submitFailed,
      submitForm,
      submitSucceeded,
      submitting,
      ...rest
    } = this.props;
    const { isSuccess, isError } = this.state;
    return (
      <Button
        {...rest}
        type="button"
        onClick={e => this.onSubmit(e)}
        className={classNames(
          className,
          classes.root,
          this.props.fullWidth ? classes.fullWidth : null,
          this.renderClassName()
        )}
        disabled={pristine || submitting || isError || isSuccess || this.props.disabled || (submitFailed && !pristine && invalid)}
      >
        {this.renderChildren()}
      </Button>
    );
  }
}

export default compose(
  connect<RemoteSubmitButtonStateProps, RemoteSubmitButtonDispatchProps, RemoteSubmitButtonProps, any>(
    mapStateToProps, mapDispatchToProps
  ),
  withStyles(styles)
)(RemoteSubmitButton);