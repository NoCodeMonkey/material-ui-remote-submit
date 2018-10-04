import { IconButton, InputAdornment, Omit, TextField, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as React from 'react';
import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import submit from './Submit';

type TextFieldProps = Omit<MuiTextFieldProps, 'component' | 'value'>;

const renderTextField: React.SFC<TextFieldProps & WrappedFieldProps & WithStyles<'textField'>> = ({
  name,
  label,
  type,
  classes,
  input,
  meta: {error, touched},
  ...rest
}) => {
  const propsAdjusted = Object.entries(rest).filter(([key]) => ![
    'add',
    'anyTouched',
    'asyncValidate',
    'autofill',
    'blur',
    'change',
    'clearAsyncError',
    'clearFields',
    'clearSubmit',
    'clearSubmitErrors',
    'dateFormat',
    'destroy',
    'expanded',
    'fieldWidths',
    'handleSubmit',
    'info',
    'initialize',
    'initialized',
    'initialValues',
    'invalid',
    'layout',
    'maxChars',
    'pure',
    'reset',
    'resetSection',
    'submit',
    'submitSucceeded',
    'toolbarTopStyles',
    'touch',
    'triggerSubmit',
    'untouch',
    'valid'
  ].includes(key))
  .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {});

  return (
    <TextField
      {...input}
      {...propsAdjusted}
      name={name}
      type={type || 'text'}
      label={label}
      className={classes.textField}
      error={Boolean(touched && error)}
      helperText={touched && error}
    />
  );
};

const style = ({palette, spacing}: Theme) => ({
  button: {
    margin: 12
  },
  error: {
    color: palette.error.main,
    marginTop: spacing.unit * 2
  },
  info: {
    marginTop: spacing.unit * 2
  },
  textField: {
    marginLeft: spacing.unit,
    marginRight: spacing.unit
  }
});

export interface RemoteSubmitFormData {
  username: string;
  password: string;
}

export interface RemoteSubmitFormState {
  showPassword: boolean;
}

type RemoteSubmitFormProps = InjectedFormProps<RemoteSubmitFormData> & WithStyles<typeof style>;

class RemoteSubmitForm extends React.Component<RemoteSubmitFormProps, RemoteSubmitFormState> {
  constructor(props: RemoteSubmitFormProps) {
    super(props);

    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);

    this.state = {
      showPassword: false
    };
  }

  public handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  }

  public render() {
    const { classes, error, handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          type="text"
          classes={classes}
          component={renderTextField}
          label="Username"
          fullWidth={true}
        />
        <Field
          name="password"
          type={this.state.showPassword ? 'text' : 'password'}
          classes={classes}
          component={renderTextField}
          label="Password"
          fullWidth={true}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={this.handleClickShowPassword}
              >
                {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }}
        />
        {error && <Typography variant="headline" gutterBottom={true} align="center" className={classes.error}>{error}</Typography>}
        <Typography variant="body2" gutterBottom={true} align="center" className={classes.info}>
        No submit button in the form. The submit button below is a separate unlinked component.
        </Typography>
      </form>
    );
  }
}

export default reduxForm({
  form: 'remoteSubmit', // a unique identifier for this form
  onSubmit: submit
})(withStyles(style)(RemoteSubmitForm));