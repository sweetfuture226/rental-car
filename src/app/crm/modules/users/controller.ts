import { OtpServices } from "./../otp/index";
import { Request, Response } from "express";
import { IRequest } from "../../../../utils/joiSetup";
import ApiResponse from "../../../../utils/response";
import UserService from "./dbService";
import JWT from "../../../../utils/jwt";
import logger from "../../../../utils/logger";
import getEmailReports from "../../../../services/mail/getEmailReports";
import getSmsReports from "../../../../services/sms/getSmsReports";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class User {
  static async createUserInternal(record) {
    // check if user already exist on db
    let thisUser = await UserService.getUserByPhone(record.phone);

    if (thisUser) {
      // confirm if this application has already been created for this user
      const userApplication = await UserService.checkUserApplication(
        thisUser.id,
        record.applicationId
      );
      if (userApplication) {
        return thisUser;
      }
      // create user application information
      await UserService.createUserApplication(
        thisUser.id,
        record.applicationId,
        record
      );
      return thisUser;
    }
    const created = await UserService.createUser(record);

    return created;
  }

  static async registerUser(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      let thisUser = await User.createUserInternal(req.body);

      if (thisUser) {
        await OtpServices.createOtpForUserLogin({
          entityId: thisUser.id,
          applicationId: req.body.applicationId,
          userInfo: thisUser
        });
        return ApiResponse.success(
          res,
          200,
          "User created successfully",
          thisUser
        );
      }
      return ApiResponse.error(res, 400, "Operation failed");
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async createUser(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      let thisUser = await User.createUserInternal(req.body);

      if (thisUser) {
        return ApiResponse.success(
          res,
          200,
          "User created successfully",
          thisUser
        );
      }
      return ApiResponse.error(res, 400, "Operation failed");
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async createUserByAdmin(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      let thisUser = await UserService.checkEmailAndPhoneUniqueness(req.body);

      if (thisUser) {
        return ApiResponse.error(res, 400, "User already exist");
      }

      thisUser = await UserService.createUser({
        ...req.body,
        uploadedBy: req.decoded.id
      });
      return ApiResponse.success(
        res,
        200,
        "User created successfully",
        thisUser
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async createUserCampaign(req: IRequest, res: Response) {
    try {
      // validate campaign id

      await UserService.validateCampaignId(req.body.campaignId);
      // check if user already exist on db
      let thisUser = await UserService.checkEmailAndPhoneUniqueness(req.body);

      if (thisUser) {
        // confirm if this campaign has already been created for this user
        const userCampaign = await UserService.checkUserCampaign(
          thisUser.id,
          req.body.campaignId
        );
        if (userCampaign) {
          throw new Error("Email and phone already exist for this campaign");
        }
        // create user campaign information
        await UserService.createUserCampaign(thisUser.id, req.body.campaignId);
        return ApiResponse.success(
          res,
          200,
          "User created successfully",
          thisUser
        );
      }
      thisUser = await UserService.createUser(req.body);
      return ApiResponse.success(
        res,
        200,
        "User created successfully",
        thisUser
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async createCampaign(req: IRequest, res: Response) {
    try {
      const {
        type,
        name,
        timezone,
        message,
        to: recipients,
        campaignDate: scheduledTime,
        mediaUrls
      } = req.body;

      // check if user already exist on db
      let thisCampaign = await UserService.getCampaign({ name });
      if (thisCampaign) {
        return ApiResponse.error(
          res,
          400,
          "campaign already exist with this name"
        );
      }
      const campaign = await UserService.createCampaign({
        ...req.body,
        ownerId: req.decoded.id
      });

      if (req.body.type && req.body.type !== "Default") {
        const emailSMSRecord = {
          type,
          timezone,
          scheduledTime,
          message,
          campaignId: campaign.id,
          status: "NOT_SENT",
          meta: { mediaUrls }
        };

        const { id: emailSmsId } = await UserService.createEmailSmsRecord(emailSMSRecord);
        await UserService.createBulkEmailSmsUser(emailSmsId, recipients);
        await UserService.createBulkUserCampaign(campaign.id, recipients);
      }

      return ApiResponse.success(
        res,
        200,
        "Campaign created successfully",
        campaign
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);

    }
  }

  static async updateCampaign(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      let thisCampaign = await UserService.getCampaign({
        id: req.params.campaignId
      });
      if (!thisCampaign) {
        return ApiResponse.error(res, 400, "campaign does not exist");
      }
      if (thisCampaign.ownerId !== req.decoded.id) {
        return ApiResponse.error(
          res,
          403,
          "you are not allowed to update this campaign"
        );
      }
      const updateObj = req.body;
      // const campaign = await UserService.updateCampaign(campaignId, updateObj);
      await thisCampaign.update(updateObj);
      await thisCampaign.reload();
      return ApiResponse.success(
        res,
        200,
        "Campaign updated successfully",
        thisCampaign
      );
    } catch (error) {
      console.log(error);
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getCampaignReports(req: IRequest, res: Response) {
    try {
      const campaignId = req.params.campaignId

      // Get emailSMSRecord
      const emailSmsRecord = await UserService.getEmailSmsRecord({ campaignId })

      if (!emailSmsRecord) return ApiResponse.error(res, 400, 'This campaign doesn\'t have reports.');

      let reports;

      if (emailSmsRecord.type === 'Email') {
        const sendgridMessageId = emailSmsRecord?.meta?.sendgridMessageId

        reports = await getEmailReports({ emailSmsId: emailSmsRecord.id, sendgridMessageId })
      }

      if (emailSmsRecord.type === 'SMS') {
        reports = await getSmsReports({ emailSmsId: emailSmsRecord.id })
      }

      return ApiResponse.success(
        res,
        200,
        "Operation was successful",
        reports
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getCampaigns(req: IRequest, res: Response) {
    try {
      const filterObj = req.isAllowed ? {} : { ownerId: req.decoded.id };
      const campaigns = await UserService.getCampaigns(filterObj, req.query);
      return ApiResponse.success(
        res,
        200,
        "Operation was successful",
        campaigns
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getAllCampaigns(req: IRequest, res: Response) {
    try {
      const campaigns = await UserService.getAllCampaignsNoPagination();
      return ApiResponse.success(
        res,
        200,
        "Operation was successful",
        campaigns
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getCampaignById(req: IRequest, res: Response) {
    try {
      const campaign = await UserService.getCampaign({
        id: req.params.campaignId
      });
      if (!campaign) {
        return ApiResponse.error(res, 400, "campaign does not exist");
      }
      return ApiResponse.success(
        res,
        200,
        "Operation was successful",
        campaign
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateUserApp(req: IRequest, res: Response) {
    try {
      const record = req.body;
      // check if user already exist on db
      const thisuserApp = await UserService.checkUserApplication(
        req.params.id,
        req.body.applicationId
      );
      // confirm if this application has already been created for this user
      if (!thisuserApp) {
        return ApiResponse.error(
          res,
          400,
          "User does not exist with this application"
        );
      }
      await UserService.updateUserApplication(thisuserApp.id, record);
      return ApiResponse.success(res, 200, "User updated successfully", null);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateUser(req: IRequest, res: Response) {
    try {
      const record = req.body;
      // check if user already exist on db
      const thisUser = await UserService.getUserById(req.params.id);
      // confirm if this user exist
      if (!thisUser) {
        return ApiResponse.error(res, 400, "User does not exist");
      }
      const updatedUser = await UserService.updateUser(thisUser.id, record);
      return ApiResponse.success(
        res,
        200,
        "User updated successfully",
        updatedUser
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async deleteUser(req: IRequest, res: Response) {
    try {
      return ApiResponse.success(res, 200, "User deleted successfully", null);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getUsers(req: IRequest, res: Response) {
    try {
      let users;
      if (req.body.applicationId) {
        users = await UserService.getAppUsers({
          applicationId: req.body.applicationId
        });
      } else {
        users = await UserService.getUsers({});
      }
      return ApiResponse.success(
        res,
        200,
        "Users retrieved successfully",
        users
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getUserById(req: IRequest, res: Response) {
    try {
      const user = await UserService.getUserById(req.params.id);
      // CHECK IF user exist
      if (!user) {
        return ApiResponse.error(res, 400, "User does not exist");
      }
      return ApiResponse.success(res, 200, "User retrieved successfully", user);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getOTpforUserLogin(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      const thisUser = await UserService.getUserByPhone(req.cleaned.phone);
      if (!thisUser) {
        return ApiResponse.error(res, 400, "User does not exist");
      }

      // confirm if user belong to app
      const userApp = await UserService.checkUserApplication(
        thisUser.id,
        req.body.applicationId
      );
      if (!userApp) {
        return ApiResponse.error(res, 400, "User not registered for this app");
      }
      const otp = await OtpServices.createOtpForUserLogin({
        entityId: thisUser.id,
        applicationId: req.body.applicationId,
        userInfo: thisUser
      });
      return ApiResponse.success(res, 200, "OTP sent successfully", otp);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async loginUser(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      const thisUser = await UserService.getUserByPhone(req.body.phone);
      if (!thisUser) {
        return ApiResponse.error(res, 400, "User does not exist");
      }
      const otp = await OtpServices.validateOTP(
        {
          entityId: thisUser.id,
          applicationId: req.body.applicationId,
          type: "LOGIN_OTP",
          entityType: "user"
        },
        req.body.otp
      );
      if (!otp) {
        return ApiResponse.error(res, 400, "OTP does not exist");
      }
      // clear otp
      await OtpServices.checkDeleteExistingOtp({
        entityId: thisUser.id,
        applicationId: req.body.applicationId,
        type: "LOGIN_OTP",
        entityType: "user"
      });
      const token = await JWT.sign(thisUser.dataValues);
      return ApiResponse.success(res, 200, "User logged in successfully", {
        user: thisUser,
        token
      });
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async paymentIntent(req: IRequest, res: Response) {
    try {
      const { paymentMethodType, amount, currency } = req.body;

      // Each payment method type has support for different currencies. In order to
      // support many payment method types and several currencies, this server
      // endpoint accepts both the payment method type and the currency as
      // parameters.
      //
      // Some example payment method types include `card`, `ideal`, and `alipay`.
      const params: any = {
        payment_method_types: [paymentMethodType],
        amount: Number(amount) * 100,
        currency
      };

      // If this is for an ACSS payment, we add payment_method_options to create
      // the Mandate.
      if (paymentMethodType === "acss_debit") {
        params.payment_method_options = {
          acss_debit: {
            mandate_options: {
              payment_schedule: "sporadic",
              transaction_type: "personal"
            }
          }
        };
      }

      // Create a PaymentIntent with the amount, currency, and a payment method type.
      // See the documentation [0] for the full list of supported parameters.
      // [0] https://stripe.com/docs/api/payment_intents/create

      const paymentIntent = await stripe.paymentIntents.create(params);

      // Send publishable key and PaymentIntent details to client
      return ApiResponse.success(res, 200, "Operation successful", {
        clientSecret: paymentIntent.client_secret
      });
    } catch (e) {
      logger("error in paymentIntent", e);
      return ApiResponse.error(res, 400, e.message);
    }
  }

  static async createChargeCredit(req: IRequest, res: Response) {
    try {
      const { amount, email } = req.body;
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        // TODO: replace line_items with your products here
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Get Baby Dreams Photos",
                images: [
                  "https://res.cloudinary.com/alliance-software-development/image/upload/v1644875376/quik-and-dasha_ruzxcn.jpg"
                ]
              },
              unit_amount: amount * 100
            },
            quantity: 1
          }
        ],
        mode: "payment",
        customer_email: email,
        success_url: `${req.headers
          .origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/?canceled=true`
      });
      return res.json({ url: session.url });
    } catch (err) {
      logger("createChargeCredit", err.message);
      return ApiResponse.error(res, 500, err.message);
    }
  }

  static async getCampaignLeads(req: IRequest, res: Response) {
    try {
      // validate campaign owner
      await UserService.validateCampaignOwner(
        req.decoded.id,
        req.params.campaignId
      );
      // get campaign users
      const campaignUsers = await UserService.getCampaignUsers(
        req.params.campaignId,
        req.query
      );
      return ApiResponse.success(
        res,
        200,
        "Leads retrieved successfully",
        campaignUsers
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async getAllLeads(req: IRequest, res: Response) {
    try {
      // get campaign users
      const leads = await UserService.getAllLeads(req.query);
      return ApiResponse.success(
        res,
        200,
        "Leads retrieved successfully",
        leads
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async getSearchDataPoints(req: IRequest, res: Response) {
    try {
      // get campaign users
      const dataPoints = await UserService.getLeadsDataPoints(req.query);
      return ApiResponse.success(
        res,
        200,
        "Leads data point retrieved successfully",
        dataPoints
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async searchAllLeads(req: IRequest, res: Response) {
    try {
      // get campaign users
      const dataPoints = await UserService.searchAllLeads(req.query);
      return ApiResponse.success(
        res,
        200,
        "Leads data point retrieved successfully",
        dataPoints
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async getPropertyValues(req: IRequest, res: Response) {
    try {
      // get campaign users
      const propertyValues = await UserService.getPropertyValues(req.query);
      return ApiResponse.success(
        res,
        200,
        "Property value retrieved successfully",
        propertyValues
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async getAvailableUsersForAnAdmin(req: IRequest, res: Response) {
    try {
      // get campaign users
      const users = await UserService.getAvailableUsersForAnAdmin(req.decoded.id, { ...req.query, ...req.body });
      return ApiResponse.success(
        res,
        200,
        "Users retrieved successfully",
        users
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }
}

export default User;
