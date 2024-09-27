import Company from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Some of the fields are missing",
        success: false,
      });
    }
    let company = await Company.findOne({
      companyName,
    });
    if (company) {
      return res.status(400).json({
        message: "You cannot add the same company again",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(200).json({
      message: "Company is successfully registered",
      company: company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(400).json({
        message: "There are no companies registered with this user id",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Companies are registered with this user id",
      companies: companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({
        message: "Company is not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company is found",
      company: company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    const updateData = {
      name,
      description,
      website,
      location,
    };
    const companyId = req.params.id;
    const company = await Company.findByIdAndUpdate(companyId, updateData, {
      new: true,
    });
    if (!company) {
      return res.status(400).json({
        message: "Company could not be found or updated",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company is successfully updated",
      company: company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
