import ActivityChild from "@/beans/common/ActivityChild";
import SubmitActivityFormRequest from "@/beans/activity/req/SubmitActivityFormRequest";
import ApiResponse from "@/beans/ApiResponse";
import {
  SCIENCE_TRAIN_ACTIVITY_ID,
  SCIENCE_TRAIN_ACTIVITY_NAME,
} from "@/definition/scienceTrain/ScienceTrainConfig";
import ActivityService from "@/service/ActivityService";
import ChildrenService from "@/service/ChildrenService";

export default class ScienceTrainParticipantService {
  private childrenService = new ChildrenService();
  private activityService = new ActivityService();

  getParticipants(): Promise<ApiResponse<ActivityChild[]>> {
    return this.childrenService
      .getActivityChildren(SCIENCE_TRAIN_ACTIVITY_ID)
      .then((response) => {
        if (response.success) {
          const participants = Array.isArray(response.data) ? response.data : [];
          response.data = participants.filter(
            (participant) => !!participant.userId
          );
        }
        return response;
      });
  }

  getRegisteredParticipants(): Promise<ApiResponse<ActivityChild[]>> {
    return this.getParticipants().then((response) => {
      if (response.success) {
        response.data = (response.data || []).filter(
          (participant) => Number(participant.isEntry) === 1
        );
      }
      return response;
    });
  }

  registerParticipant(subUserId: string) {
    const request = new SubmitActivityFormRequest();
    request.subUserId = String(subUserId);
    request.preview = "0";
    request.entryWay = "4";
    request.fields = [];
    return this.activityService.submitActivityForm(
      SCIENCE_TRAIN_ACTIVITY_ID,
      request,
      SCIENCE_TRAIN_ACTIVITY_NAME
    );
  }
}
