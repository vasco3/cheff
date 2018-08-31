import React, { Fragment } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderContent,
} from 'rmwc/Drawer';
import { Typography } from 'rmwc/Typography';
import { ListDivider } from 'rmwc/List';
import { Icon, Ripple } from 'rmwc';

function MenuDrawerItem({ children, href, pathname }) {
  return (
    <Link href={href}>
      <Ripple>
        <Typography
          use="body1"
          tag="div"
          className={`p-4 flex${href === pathname &&
            ' mdc-list-item--activated'}`}
        >
          {children}
        </Typography>
      </Ripple>
    </Link>
  );
}

const MenuDrawer = ({
  isMobile,
  open,
  onClose,
  router,
  temporary,
  persistent,
}) => {
  return (
    <Drawer
      onClose={onClose}
      open={open}
      persistent={persistent}
      temporary={temporary}
    >
      {!isMobile && (
        <DrawerHeader>
          <DrawerHeaderContent>
            <Typography use="headline5" theme="primary">
              Cheff
            </Typography>
          </DrawerHeaderContent>
        </DrawerHeader>
      )}
      <DrawerContent>
        {isMobile && (
          <Typography use="headline5" theme="primary" tag="div" className="m-4">
            Cheff
          </Typography>
        )}
        <MenuDrawerItem href="/calculator" pathname={router.pathname}>
          <Fragment>
            <Icon use="settings" className="mr-4" theme="primary" /> Calculator
          </Fragment>
        </MenuDrawerItem>
        <MenuDrawerItem href="/recipes" pathname={router.pathname}>
          <Fragment>
            <Icon use="restaurant" className="mr-4" theme="secondary" /> Recipes
          </Fragment>
        </MenuDrawerItem>
        <MenuDrawerItem href="/plan" pathname={router.pathname}>
          <Fragment>
            <Icon use="list_alt" className="mr-4" theme="primary" /> Meal Plan
          </Fragment>
        </MenuDrawerItem>

        <ListDivider />

        <MenuDrawerItem href="/about" pathname={router.pathname}>
          <Fragment>
            <Icon use="info" className="mr-4" /> About
          </Fragment>
        </MenuDrawerItem>

        <MenuDrawerItem href="/" pathname={router.pathname}>
          <Fragment>
            <Icon use="help_outline" className="mr-4" /> Help
          </Fragment>
        </MenuDrawerItem>

        <Typography use="overline" tag="div" className="px-4">
          Advanced
        </Typography>
        <ListDivider />

        <MenuDrawerItem href="/sync" pathname={router.pathname}>
          <Fragment>
            <Icon use="compare_arrows" className="mr-4" /> Sync
          </Fragment>
        </MenuDrawerItem>
      </DrawerContent>
    </Drawer>
  );
};

export default withRouter(MenuDrawer);
