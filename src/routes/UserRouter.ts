/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */

import * as express from 'express';
import { SpinalServiceUser } from 'spinal-service-user';
import * as status from 'http-status';
import { UserInterface } from 'spinal-models-user/declarations/SpinalUser';
import * as config from '../../config.js';

const gRoot = typeof window === 'undefined' ? global : window;

const userRouter = express.Router();

const option = {
  hostname: config.spinalConnector.host,
  post: config.spinalConnector.port,
};

/* GET home page. */
userRouter.post('/login', async (req, res) => {

  try {
    const user = await SpinalServiceUser
      .getUser(option, req.body.email, req.body.password);

    const js = {};

    if (user.hasOwnProperty('name')) {
      js['name'] = user['name'].get();
    }

    if (user.hasOwnProperty('firstname')) {
      js['firstname'] = user['firstname'].get();
    }

    if (user.hasOwnProperty('email')) {
      js['email'] = user['email'].get();
    }

    if (user.hasOwnProperty('name')) {
      js['password'] = user['password'].get();
    }

    js['id'] = user['id'].get();
    return res.json(js);
  } catch (e) {
    res.status(status.BAD_REQUEST).json({error: e.message});
  }

});

userRouter.post('/verifyemail', async (req, res) => {

  const result = await SpinalServiceUser.findEmail(req.body.email);
  if (result.hasOwnProperty('email')) {
    return res.json({ok: result});
  }

});

userRouter.post('/user', async (req, res) => {
  const result = await SpinalServiceUser.createUser(
    option,
    {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      firstname: req.body.firstname,
    },
  );
  if (result.hasOwnProperty('id')) {
    return res.json({ok: result});
  }

  return res.json({bad: result});

});

export { userRouter };
