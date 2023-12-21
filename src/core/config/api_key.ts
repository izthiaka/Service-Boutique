import { Request, Response, NextFunction } from "express"

const settingApiKey = (req: Request, res: Response, next: NextFunction) => {
    const { platform } = req.headers
    if (!platform) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (platform && platform !== process.env.API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next()
}

export default settingApiKey
