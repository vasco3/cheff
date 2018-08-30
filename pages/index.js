import { Typography } from 'rmwc';
import Link from 'next/link';

const IndexPage = () => {
  return (
    <div>
      <Typography use="headline4" tag="div" className="mx-4 my-4">
        Usage
      </Typography>

      <Typography use="subtitle1" tag="div" className="mx-4">
        How to use this app
      </Typography>

      <Typography use="body1" tag="div" className="mx-4">
        <ol>
          <li>
            Set your macro targets in <Link href="/calculator">Calculator</Link>{' '}
          </li>
          <li>
            In <Link href="/recipes">Recipes</Link> add 10 or more food recipes
            that you normally eat
          </li>
          <li>
            In <Link href="/plan">Meal Plan</Link> Click the generate button to
            randomly generate combinations of your recipes to hit your calories
            and macro goals per day
          </li>
        </ol>
      </Typography>
    </div>
  );
};

export default IndexPage;
