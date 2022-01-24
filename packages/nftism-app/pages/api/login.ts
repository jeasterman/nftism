import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ethers } from "ethers";
import { formatEther, verifyMessage } from "ethers/lib/utils";

import { sessionOptions, User } from "@lib/session";
import { ERC20_ABI, networkConfig, Networks } from "@lib/blockchain";
import { NFTISM_LOGIN_MESSAGE } from "@lib/constants";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { signature } = await req.body;

  try {
    const address = verifyMessage(NFTISM_LOGIN_MESSAGE, signature);
    const balance = await new ethers.Contract(
      networkConfig[Networks.MAINNET].nftismContract,
      ERC20_ABI,
      new ethers.providers.JsonRpcProvider(networkConfig[Networks.MAINNET].uri)
    ).balanceOf(address);

    const user = {
      isLoggedIn: true,
      tokenBalance: parseInt(formatEther(balance)),
    } as User;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
