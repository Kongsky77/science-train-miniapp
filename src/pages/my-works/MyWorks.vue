<style lang="scss" scoped>
@import "MyWork.scss";
</style>
<template>
  <view
    class="page"
    :style="{
      background: background || '',
    }"
  >
    <view class="container">
      <div class="header">
        <div class="header-top">
          <div
            class="preview-img-container"
            @click="
              moveToImagePage(imgComponentModel.PREVIEW, shareWorkModel.RATE)
            "
            :style="{
              background: `url(${previewImg}) no-repeat center`,
              backgroundSize: `cover`,
            }"
          ></div>
          <div class="product-details">
            <view class="title">{{ activityFullItemVO.name }}</view>
            <!-- <view class="guide-study-url">活动地址：{{ activityFullItemVO.guideStudyUrl }}</view> -->
            <view class="time">活动时间： </view>
            <view class="time"
              >{{ activityFullItemVO.startTime + "起" }} -
              {{ activityFullItemVO.endTime + "止" }}
            </view>
            <!-- <view class="share-btn">
            <view class="share-work" @click="moveToImagePage(imgComponentModel.SELECT,shareWorkModel.WORK)">
              <image :src="staticFile.PRODUCT_SHARE_ICON"></image> 分享作品
            </view>
            <view class="share-score" @click="moveToImagePage(imgComponentModel.SELECT,shareWorkModel.RATE)">
              <image :src="staticFile.PRODUCT_RATE_SHARE_ICON"></image> 分享评分
            </view>
          </view> -->
          </div>
        </div>
        <div class="header-bottom" v-if="workContentVO.description">
          <view class="title">{{ lang.DESCRIBE_TITLE }}</view>
          <view class="content">{{ workContentVO.description }}</view>
        </div>
      </div>

      <div class="star">
        <view class="title">
          <view class="text">专家评分</view>
        </view>
        <van-rate
          class="star-ul"
          :value="starEvaluationVO.rateStar"
          size="50"
          color="#F19E38"
          void-icon="star"
          readonly
          void-color="#B2B2B2"
        />
      </div>
      <div class="comment">
        <view class="title">
          <view class="text">{{ lang.EXPERT_TITLE }}</view>
        </view>
        <view class="comment-container">
          <view v-if="commentList.length > 0">
            <div v-for="item in commentList" :key="item.id">
              <comment-list
                v-if="item.comment"
                :is-show-border="false"
                @on-avatar-click="onAvatarClick"
                :work-comment-item-v-o="item"
              />
            </div>
          </view>
          <van-empty
            v-else
            class="custom-image"
            :image="staticFile.NO_COLLECT_NOTICE_IMG"
            :description="lang.NO_COMMENT_TEXT"
          />
          <view
            class="see-more-comment"
            v-if="commentList.length > 0"
            @click="onMoreClick"
          >
            <view class="text">{{ lang.SEE_MORE_COMMENT }}</view>
            <view class="more-btn" @click="moveToAllCommentPage">
              <image class="more" :src="staticFile.MORE_KNOWLEDGE_ICON" />
            </view>
          </view>
        </view>
      </div>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// components
import StarRate from "@/components/rate/StarRate.vue";
import CommentList from "@/components/expert/CommentList.vue";
// beans
import WorkContentVO from "@/beans/rate/WorkContentVO";
import StarEvaluationVO from "@/beans/rate/StarEvaluationVO";
import WorkCommentListVO from "@/beans/rate/WorkCommentListVO";
import WorkCommentItemVO from "@/beans/rate/simple/WorkCommentItemVO";
// beans old
import ActivityFullItem from "@/beans/activity/ActivityFullItem";
import ListRequest from "@/beans/activity/req/ListRequest";
//common
import { Utils } from "@/common/utils/Utils";
import LangEnum from "@/definition/lang/LangEnum";
import EntityTypeEnum from "@/definition/rate/EntityTypeEnum";
import StaticFileEnum from "@/definition/lang/StaticFileEnum";
// services
import ActivityService from "@/service/ActivityService";
import RateService from "@/service/RateService";
import PageLinkEnum from "@/definition/lang/PageLinkEnum";
import ImgComponentModelEnum from "@/definition/common/ImgComponentModelEnum";
import ChildrenService from "@/service/ChildrenService";
import UserInfoResponse from "@/beans/common/UserInfoResponse";
import ShareWorkModelEnum from "@/definition/common/ShareWorkModelEnum";
import BuriedPointRequest from "@/beans/user/req/BuriedPointRequest";
import BadgeService from "@/service/BadgeService";
import BuriedPointService from "@/service/BuriedPointService";
import SimpleUserInfoVO from "@/beans/rate/simple/SimpleUserInfoVO";

class OptionScene {
  productId: string = "";
  activityId: string = "";
  childrenId: string = "";
  buriedPointId: string = "";
}

@Component({
  name: "MyWorks",
  components: {
    StarRate,
    CommentList,
  },
})
export default class MyWorks extends Vue {
  lang = LangEnum;
  staticFile = StaticFileEnum;

  tagList: string[] = [];
  productId: string = "";
  previewImg: string = "";
  activityId: string = "";
  childrenId: string = "";
  buriedPointId: string = "";
  isExpertInfoShow: boolean = false;
  modelUserInfo: SimpleUserInfoVO = new SimpleUserInfoVO();
  shareWorkModel = ShareWorkModelEnum;
  imgComponentModel = ImgComponentModelEnum;

  workContentVO: WorkContentVO = new WorkContentVO();
  starEvaluationVO: StarEvaluationVO = new StarEvaluationVO();
  workCommentListVO: WorkCommentListVO = new WorkCommentListVO();
  activityFullItemVO: ActivityFullItem = new ActivityFullItem();

  onLoad(option: OptionScene) {
    this.productId = option.productId;
    this.activityId = option.activityId;
    this.childrenId = option.childrenId;
    this.buriedPointIn(option);
    this.fetchActivityItem();
  }

  buriedPointIn(option: OptionScene) {
    const url = `/pages/my-works/MyWorks?activityId=${option.activityId}&productionId=${option.productId}&subUserId=${option.childrenId}`;
    BuriedPointService.in(url, (buriedPointId: string) => {
      this.buriedPointId = buriedPointId;
    });
  }

  onStarAreaClick() {
    if (this.workCommentListVO.records.length > 0) {
      this.moveToAllCommentPage();
    } else {
    }
  }

  onTagClick(item: string) {
    if (item === "...") {
      this.tagList = this.modelUserInfo.tagList;
    }
  }

  getTagList() {
    let tags: string[] = [];
    if (this.modelUserInfo.tagList.length > 2) {
      this.modelUserInfo.tagList.map((item) => {
        tags.push(item);
      });
      tags.pop();
      tags.push("...");
      return tags;
    } else {
      tags = this.modelUserInfo.tagList;
      return tags;
    }
  }

  buriedPoint(buriedPointRequest: BuriedPointRequest) {}

  onAvatarClick(simpleUserInfoVO: SimpleUserInfoVO) {
    this.modelUserInfo = simpleUserInfoVO;
    this.tagList = this.getTagList();
    this.isExpertInfoShow = true;
  }

  moveToImagePage(
    imgComponentModel: ImgComponentModelEnum,
    shareWorkModel: ShareWorkModelEnum
  ) {
    switch (imgComponentModel) {
      case ImgComponentModelEnum.SELECT:
        this.moveToSelectPage(shareWorkModel);
        break;
      case ImgComponentModelEnum.PREVIEW:
        this.moveToPreviewPage();
        break;
      default:
        this.moveToPreviewPage();
        break;
    }
  }

  get background() {
    return `url("${process.env.VUE_APP_BLOB_IMAGE_URL_NEW}/index/index_bg.png") repeat 100% 100%`;
  }

  beforeDestroy() {
    BuriedPointService.out(this.buriedPointId);
  }

  moveToPreviewPage() {
    uni.navigateTo({
      url: `${PageLinkEnum.IMG_PREVIEW}?productId=${this.productId}&imgComponentModel=${ImgComponentModelEnum.PREVIEW}`,
    });
  }

  moveToSelectPage(shareWorkModel?: ShareWorkModelEnum) {
    uni.navigateTo({
      url: `${PageLinkEnum.IMG_PREVIEW}?shareWorkModel=${shareWorkModel}&childrenId=${this.childrenId}&activityId=${this.activityId}&productId=${this.productId}&imgComponentModel=${ImgComponentModelEnum.SELECT}`,
    });
  }

  moveToAllCommentPage() {
    uni.navigateTo({
      url: `${PageLinkEnum.ALL_COMMENT}?productId=${this.productId}&activityId=${this.activityId}`,
    });
  }

  onMoreClick() {
    this.moveToAllCommentPage();
  }

  get commentList(): Array<WorkCommentItemVO> {
    return this.workCommentListVO.records;
  }

  get firstPeopleTime() {
    const firstPeopleIndex = 0;
    const firstItem = this.workCommentListVO.records[firstPeopleIndex];
    if (firstItem) {
      return Utils.getAgoAt(firstItem.time);
    }
  }

  get firstPeopleInfo() {
    const firstPeopleIndex = 0;
    if (this.workCommentListVO.records[firstPeopleIndex]) {
      return this.workCommentListVO.records[firstPeopleIndex].user;
    } else {
      return "xxx";
    }
  }

  fetchActivityItem() {
    const activityService = new ActivityService();
    const activityItem = activityService.getDetail(this.activityId);
    activityItem.then((res) => {
      this.activityFullItemVO = res.data;
      this.activityFullItemVO.startTime = Utils.startTimeYMDh(
        res.data.startTime
      );
      this.activityFullItemVO.endTime = Utils.startTimeYMDh(res.data.endTime);
      this.fetchMyWorkDetail();
    });
  }

  fetchMyWorkDetail() {
    const rateService = new RateService();
    rateService.receiveWorkDetail(
      this.productId,
      this.receiveWorkDetailCallback
    );
  }

  receiveWorkDetailCallback(success: boolean, result: WorkContentVO) {
    if (success) {
      this.workContentVO = result;
      this.previewImg = result.files[0].url;
      this.fetchStarEvaluation();
    }
  }

  fetchStarEvaluation() {
    const rateService = new RateService();
    const entityType = EntityTypeEnum.PERSONAL_WORKS;
    rateService.receiveStarSystemEvaluation(
      entityType,
      this.productId,
      this.receiveStarSystemEvaluationCallback
    );
  }

  onPullDownRefresh() {
    let that = this;
    setTimeout(function() {
      that.fetchActivityItem();
      that.fetchMyWorkDetail();
      uni.stopPullDownRefresh();
    }, 1000);
  }

  receiveStarSystemEvaluationCallback(
    success: boolean,
    result: StarEvaluationVO
  ) {
    if (success) this.starEvaluationVO = result;
    this.fetchCommentList();
  }

  fetchCommentList() {
    const rateService = new RateService();
    const entityType = EntityTypeEnum.PERSONAL_WORKS;
    const listDTO = new ListRequest();
    listDTO.pageNo = 1;
    listDTO.pageSize = 5;
    rateService.receiveCommentList(
      entityType,
      this.productId,
      listDTO,
      this.fetchCommitListCallback
    );
  }

  fetchCommitListCallback(success: boolean, result: WorkCommentListVO) {
    if (success) this.workCommentListVO = result;
  }
}
</script>

