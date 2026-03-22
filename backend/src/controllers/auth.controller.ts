import { Request, Response } from 'express';
import User, { IUser } from '../models/User.model'; 
import jwt from 'jsonwebtoken';
import randomName from '@scaleway/random-name'
import { CookieOptions } from "express";

const generateToken = (id: string) => {
  const accessToken=jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' })
  return accessToken;
};

const isProd = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProd, // as prod support https
  // 'lax' for same-domain/localhost, 'none' for cross-domain production
  sameSite: isProd ? 'none' : 'lax',  // none as deployment can be with diff domains on prod
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    
    const { email, password, name=null }:RegisterRequest = req.body;

    const handle:string= name ?? randomName()
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password, name:handle });

    const accessToken=generateToken(user._id.toString())

    //  SET THE COOKIE
    res.cookie('token', accessToken, COOKIE_OPTIONS);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: accessToken,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

interface LoginRequest {
  email: string;
  password: string;
}
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }:LoginRequest = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken=generateToken(user._id.toString())
      res.cookie('token', accessToken, COOKIE_OPTIONS);

      res.json({
        _id: user._id,
        email: user.email,
        token: accessToken,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = (req: Request, res: Response) => {
  // Clear the cookie 
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Set to January 1, 1970
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};