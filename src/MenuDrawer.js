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

const MenuDrawer = ({ open, onClose, temporary, persistent }) => {
  return (
    <Drawer
      onClose={onClose}
      open={open}
      persistent={persistent}
      temporary={temporary}
    >
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
              <Icon use="settings" className="mr-4" theme="primary" />{' '}
              Calculator
            </Typography>
          </Ripple>
        </Link>
        <Link href="/recipes">
          <Ripple>
            <Typography use="body1" tag="div" className="p-4 flex">
              <Icon use="restaurant" className="mr-4" theme="secondary" />{' '}
              Recipes
            </Typography>
          </Ripple>
        </Link>
        <Link href="/plan">
          <Ripple>
            <Typography use="body1" tag="div" className="p-4 flex">
              <Icon use="restaurant" className="mr-4" theme="primary" /> Meal
              Plan
            </Typography>
          </Ripple>
        </Link>
        <ListDivider />
        <Link href="/about">
          <Ripple>
            <Typography use="body1" tag="div" className="p-4 flex">
              <Icon use="help" className="mr-4" /> About
            </Typography>
          </Ripple>
        </Link>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
