const { Op } =require('sequelize');
const formRecords = require('./formElements.json');
// @ts-ignore
const db = require('../db/models');

const { FormElement, Admin } = db;
const getSuperAdmin = async () => {
  return Admin.findOne({
    where: {
      email: 'superadmin@alliancedevelopment.com'
    }
  })
}

const createInitialFormElement = async () => {
  try {
  const superAdmin = await getSuperAdmin();

  const bulkRecords =  formRecords.formElements.map(({dataType, ...rest}) => ({
    ...rest,
    meta: {
      dataType
    },
    createdBy: superAdmin.id,
    updatedBy: superAdmin.id
  }));

  // create permission
  await FormElement.bulkCreate(bulkRecords, { ignoreDuplicates: true });
} catch (error) {
    console.log(error.message, 'all form elements creation failed')
}
}



module.exports = createInitialFormElement;

