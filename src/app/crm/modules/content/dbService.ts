import { generateRandomAccessKeyString } from '../../../../utils/helpers';
import { IUIContent, IUIContentCreate, IUIContentUpdate } from "./types";
//@ts-ignore
import { UIContent } from '../../../../db/models';

class UIContentService  {
  static async createUIContent (payload: IUIContentCreate): Promise<IUIContent> {
    // create UIContent 
     const createdUIContent = await UIContent.create(payload);
    return createdUIContent;  
  }

  static async updateUIContent (id: string, payload: IUIContentUpdate) {
    return UIContent.update(payload, { where: { id } });
  }

  static async deleteUIContent (id: string) {
    return UIContent.destroy({ where: { id } });
  }

  static async getUIContent (where: any) {
    return UIContent.findOne({ 
      where,
    });
  }

  static async getUIContents (where: any = {}) {
    return UIContent.findAll(
      {
        where,
      }
    );
  }
};

export default UIContentService;