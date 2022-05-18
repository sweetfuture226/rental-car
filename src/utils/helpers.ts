import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const generateRandomAccessKeyString = (): string => crypto.randomBytes(32).toString('hex');

// hash password with bcrypt
export const passwordHasher = async (password: string): Promise<string> => {
  return bcrypt.hashSync(password, 10);
}

export const comparePassword = async (input: string, dbPassword: string) => {
  try {
    const compare = await bcrypt.compare(input, dbPassword);
    return compare;
  } catch (error) {
    return false;
  }
}

export const getExpiryTimeInMins = (expiryTimeInMins: number = 5) => {
  return new Date(Date.now() + (expiryTimeInMins * 60 * 1000));
}

export const cleanUpDBRes = (raw: any) => {
  const notAllowed = ['password']
  const record = raw?.dataValues;
  if (!record) return raw
  for (const element of notAllowed) {
    delete record[element]
  }

  return record
}

export const managePagination = (rawPage: number, pageSize: number) => {
  // calculate offset and limit
  const page = rawPage > 0 ? rawPage - 1 : 1;
  const offset = page * pageSize;
  const limit = pageSize;
  return { offset, limit };
}

export const cleanUpPaginatedData = (data: any, { pageSize, page }) => {
  if (!data?.count || !data?.rows) return data
  const { rows, count } = data;
  // return totalPages, totalRecords, data, count
  const record: any = { count, received: rows?.length };

  if (pageSize) {
    // calculate totalPages
    const totalPages = Math.ceil(count / pageSize);
    record.totalPages = totalPages;
  }
  if (page) {
    // return current page
    record.currentPage = page;
  }
  record.rows = rows;
  return record
};

export const attachHttpToLink = (link: string) => {
  if (!link.startsWith('http') || !link.startsWith('https')) {
    return `https://${link}`
  }
  return link;
}

export const manageFilters = (filters: any, Op: any) => {
  if (Object.keys(filters).length > 0) {
    filters = JSON.parse(filters)
    const { fuzzy, match, integerGreater, integerLess } = filters
    const where = {}
    if (Object.keys(fuzzy).length) {
      for (let [key, value] of Object.entries(fuzzy)) {
        where[key] = {
          [Op.iLike]: `%${value}%`
        }
      }
    }
    if (Object.keys(match).length) {
      for (let [key, value] of Object.entries(match)) {
        where[key] = value
      }
    }
    if (Object.keys(integerGreater).length) {
      for (let [key, value] of Object.entries(integerGreater)) {
        where[key] = {
          [Op.gt]: value
        }
      }
    }
    if (Object.keys(integerLess).length) {
      for (let [key, value] of Object.entries(integerLess)) {
        where[key] = {
          [Op.lt]: value
        }
      }
    }
    return where
  }

  return null

}

export const manageSearchFilters = (filters: any, Op: any, { mainVals, optionals }) => {
  const mainValueArr = {};
  const optionalValueArr = {
    [Op.and] :[],
  };
  const andArr = []
  if(Object.keys(filters).length > 0){
    filters = JSON.parse(filters)
    // For each filter
    // const where = {}
    for (let [key, values] of Object.entries(filters)){
      if (Object.keys(values).length){
        for (let [comparison, filtervalues] of Object.entries(values)){
          if(comparison === "equal"){
            // where[key] = {
            //   [Op.in]: filtervalues
            // };
            if(mainVals?.includes(key)){
              mainValueArr[key] = {
                [Op.in]: filtervalues
              }
            } else {
              andArr.push({
                key,
                value: {
                  [Op.in]: filtervalues
                }
              });
            }
          }
          if(comparison === "notEqual"){
            // where[key] = {
            //   [Op.notIn]: filtervalues
            // }
            if(mainVals?.includes(key)){
              mainValueArr[key] = {
                [Op.notIn]: filtervalues
              }
            } else {
              andArr.push({
                key,
                value: {
                  [Op.notIn]: filtervalues
                }
              });
            }
          }
        }
      }
    }
    optionalValueArr[Op.and] = andArr;
    return  { mainValueArr, optionalValueArr }
  }
  return null
}
