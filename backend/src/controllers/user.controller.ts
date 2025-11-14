
import 'dotenv/config';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  signup = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.service.signup(req.body.form);
      return res.status(201).json({ message: 'Signed up succesfully!' });
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        return res.status(409).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message });
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { accessToken, refreshToken, user } = await this.service.login(req.body.form);
      console.log(user);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ message: 'Logged in successfully', token: accessToken, user });
    } catch (err: any) {
      if (err.message === 'User not found') {
          return res.status(404).json({ message: err.message });
      }
      return res.status(401).json({ message: 'Something went wrong' });
    }
  };
  
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
      try {
          const token = req.cookies.refreshToken;
          if (!token) return res.status(401).json({ message: "No refresh token provided." });
          const newAccessToken = await this.service.refreshToken(token);
          return res.json({ token: newAccessToken });
      } catch (err: any) {
          return res.status(403).json({ message: err.message });
      }
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
      return res.status(200).json({ message: "Logged out successfully" });
  };
  
  editProfile = async (req: Request, res: Response): Promise<Response> => {
      try {
          const userId = (req as any).user.userId;
          const { token, user } = await this.service.editProfile(userId, req.body.formData);
          return res.status(200).json({ message: "Profile Updated Successfully", token, updatedUser: user });
      } catch (err: any) {
          return res.status(500).json({ message: err.message });
      }
  };
  
  getProfile = async (req: Request, res: Response): Promise<Response> => {
      try {
          const { userId } = req.body;
          const user = await this.service.getProfile(userId);
          if (!user) return res.status(404).json({ message: "User not found" });
          // Avoid sending password hash to the client
          const { password, ...userProfile } = user.get({ plain: true });
          return res.status(200).json({ user: userProfile });
      } catch (err: any) {
          return res.status(500).json({ message: err.message });
      }
  };

  changePassword = async (req: Request, res: Response): Promise<Response> => {
      try {
          const userId = (req as any).user.userId;
          const { currentPassword, newPassword } = req.body.passwordData;
          await this.service.changePassword(userId, currentPassword, newPassword);
          return res.status(200).json({ message: 'Password changed successfully!' });
      } catch (err: any) {
          return res.status(401).json({ message: err.message });
      }
  };
  
  uploadProfilePhoto = async (req: Request, res: Response): Promise<Response> => {
      try {
          if (!req.file) {
              return res.status(400).json({ message: "No image was uploaded." });
          }
          const userId = (req as any).user.userId;
          const profilePhotoUrl = await this.service.uploadProfilePhoto(userId, req.file);
          return res.status(200).json({ message: 'Profile photo updated successfully!', profilePhotoUrl });
      } catch (err: any) {
          return res.status(500).json({ message: err.message });
      }
  };
}