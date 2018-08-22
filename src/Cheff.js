import Recipes from './Recipes';
import Menu from './Menu';
import recipes from '../data/recipes';

const Cheff = () => {
  return (
    <div>
      <Menu recipes={recipes} />
      <Recipes recipes={recipes} />
    </div>
  );
};

export default Cheff;
