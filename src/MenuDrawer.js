import Link from 'next/link';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderContent,
} from 'rmwc/Drawer';
import { Typography } from 'rmwc/Typography';
import { ListDivider } from 'rmwc/List';
import { Icon, Ripple } from 'rmwc';

const MenuDrawer = ({ open, onClose }) => {
  return (
    <Drawer temporary open={open} onClose={onClose}>
      <DrawerHeader>
        <DrawerHeaderContent>
          <Typography use="headline5" theme="primary">
            Cheff
          </Typography>
        </DrawerHeaderContent>
      </DrawerHeader>
      <DrawerContent>
        <Link href="/">
          <Ripple>
            <Typography use="body1" tag="div" className="p-4 flex">
              <Icon use="restaurant" className="mr-4" theme="primary" /> Meal
              Plan
            </Typography>
          </Ripple>
        </Link>
        {/* <Link href="recipes">
          <Ripple>
            <Typography use="body1" tag="div" className="p-4 flex">
              <Icon use="restaurant" className="mr-4" theme="secondary" />{' '}
              Recipes
            </Typography>
          </Ripple>
        </Link>
        <ListDivider />
        <Ripple>
          <Typography use="body1" tag="div" className="p-4 flex">
            <Icon use="settings" className="mr-4" /> Settings
          </Typography>
        </Ripple>
        <Link href="about">
          <Ripple>
            <Typography use="body1" tag="div" className="p-4 flex">
              <Icon use="help" className="mr-4" /> About
            </Typography>
          </Ripple>
        </Link> */}
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
