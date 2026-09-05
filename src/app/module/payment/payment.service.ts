import { BidStatus } from "../../../../prisma/src/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middleware/authCheck";

const initiateCheckout = async (assignmentId: string, user: RequestUser) => {
  const bid = await prisma.assignmentBid.findFirst({
    where: {
      assignmentId,
      status: BidStatus.ACCEPTED,
    },
  });
  console.log(bid);
};

export const paymentService = {
  initiateCheckout,
};
