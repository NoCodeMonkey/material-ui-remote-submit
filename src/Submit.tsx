import { SubmissionError } from 'redux-form';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default (async function submit(values: any) {
  await sleep(1000); // simulate server latency
  if (!['john', 'paul', 'george', 'ringo'].includes(values.username)) {
    throw new SubmissionError({
      _error: 'Login failed!',
      username: 'User does not exist'
    });
  } else if (values.password !== 'redux-form') {
    throw new SubmissionError({
      _error: 'Login failed!',
      password: 'Wrong password'
    });
  } else {
    window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
  }
});