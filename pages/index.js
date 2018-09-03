import Link from 'next/link';
import { Typography, ListDivider } from 'rmwc';
import { TextField } from 'rmwc/TextField';

const IndexPage = () => {
  return (
    <div>
      <Typography use="headline4" tag="div" className="mx-4 my-4">
        Installation
      </Typography>
      <Typography use="body1" tag="div" className="mx-4">
        Minimal. This is a web app. Which means you can save it at your
        homescreen or bookmark it. Nothing else required.
      </Typography>

      <Typography use="headline4" tag="div" className="mx-4 my-4">
        Usage
      </Typography>

      <Typography use="subtitle1" tag="div" className="mx-4">
        How to use this app
      </Typography>

      <Typography use="body1" tag="div" className="mx-4">
        <ol>
          <li>
            Set your macro targets in{' '}
            <Link href="/calculator">
              <a>Calculator</a>
            </Link>{' '}
          </li>
          <li>
            In{' '}
            <Link href="/recipes">
              <a>Recipes</a>
            </Link>{' '}
            add 10 or more food recipes that you normally eat
          </li>
          <li>
            In{' '}
            <Link href="/plan">
              <a>Meal Plan</a>
            </Link>{' '}
            Click the generate button to randomly generate combinations of your
            recipes to hit your calories and macro goals per day
          </li>
        </ol>
      </Typography>

      <ListDivider />

      <Typography use="headline5" tag="div" className="m-4">
        Thoughts or suggestions?
      </Typography>
      <TextField
        className="mx-4"
        label="Suggestions"
        name="suggestions"
        defaultValue=""
        textarea
        rows="1"
      />
    </div>
  );
};

export default IndexPage;
