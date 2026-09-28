<template>
  <view class="page">
    <view
      class="title"
      v-text="
        !isFieldsHidden
          ? '以下是参加此次活动时的报名信息'
          : '请确认您的基本信息'
      "
    ></view>
    <view
      class="title"
      v-if="isActivityEnd"
    >活动已结束，不可修改!</view>
    <view class="form-row">
      <view class="notice">
        名字（不可变更）
      </view>
      <view class="filed">
        <view style="width: 100%">
          <van-field
            v-model="userActivityEntryInfo.realName"
            :border="false"
            readonly
          />
        </view>
      </view>
    </view>
    <view class="form-row">
      <view class="notice">
        报名电话（不可变更）
      </view>
      <view class="filed">
        <view style="width: 100%">
          <van-field
            v-model="userActivityEntryInfo.phoneNumber"
            :border="false"
            readonly
          />
        </view>
      </view>
    </view>

    <!-- 省市区县选择 -->
    <view
      class="form-row"
      @click="onRegionButtonClick"
      v-if="isTurnOnDistrict && isFieldsHidden"
    >
      <view class="notice">省市区县</view>
      <view class="filed">
        <view style="width: 100%">
          <van-field
            v-model="regionName"
            :border="false"
            :disabled="isActivityEnd"
            is-link
            readonly
            clickable
            placeholder="请选择"
          />
        </view>
      </view>
    </view>

    <view
      class="form-row"
      @click="toSelectSchool()"
    >
      <view class="notice">
        学校
      </view>
      <view class="filed">
        <view style="width: 100%">
          <van-field
            v-model="userActivityEntryInfo.orgName"
            :border="false"
            :disabled="isActivityEnd"
            is-link
            readonly
            clickable
            placeholder="请选择"
          />
        </view>
      </view>
    </view>
    <view
      class="form-row"
      @click="toggleGradePopUp(true)"
    >
      <view class="notice">
        年级
      </view>
      <view class="filed">
        <view style="width: 100%">
          <van-field
            v-model="gradeTitle"
            :disabled="isActivityEnd"
            :border="false"
            is-link
            readonly
            clickable
            placeholder="请选择"
          />
        </view>
      </view>
    </view>
    <view
      class="form-row"
      v-if="mustIdNo"
    >
      <view class="notice">
        身份证号
      </view>
      <view class="filed">
        <view style="width: 100%">
          <van-field
            v-model="userActivityEntryInfo.idNo"
            :border="false"
            placeholder="必填"
            @change="userActivityEntryInfo.idNo = $event.detail"
          />
        </view>
      </view>
    </view>
    <template v-if="!isFieldsHidden">
      <view
        v-for="form of userActivityEntryInfo.fields"
        :key="form.filedId"
        class="form-row"
      >
        <DynamicFormInput
          class="form-item"
          v-if="form.type === formTypeEnum.INPUT"
          :form="form"
          :isActivityEnd="isActivityEnd"
          @change="onFormChange(form, '$event')"
        >
        </DynamicFormInput>
        <DynamicFormUpload
          class="form-item"
          v-if="form.type === formTypeEnum.UPLOAD"
          :form="form"
          :isActivityEnd="isActivityEnd"
          :childId="childId"
          @change="onFormChange(form, '$event')"
        >
        </DynamicFormUpload>
        <DynamicFormCascader
          class="form-item"
          v-if="form.type === formTypeEnum.CASCADER"
          :isActivityEnd="isActivityEnd"
          :form="form"
          @change="onFormChange(form, '$event')"
        >
        </DynamicFormCascader>

        <DynamicFormCheckbox
          class="form-item"
          v-if="form.type === formTypeEnum.CHECKBOX"
          :isActivityEnd="isActivityEnd"
          :form="form"
          @change="onFormChange(form, '$event')"
        >
        </DynamicFormCheckbox>
      </view>
    </template>
    <div class="btn-box">
      <view
        class="submit-btn"
        v-if="!isActivityEnd"
        @click="submit"
      >
        确定
      </view>

      <!-- <view class="submit-btn" v-if="isActivityEnd" style="background: #C8CDDB;">
        活动结束，不可修改
      </view> -->

      <!-- <view class="submit-btn" @click="back"> 返回 </view> -->
    </div>
    <van-popup
      :show="gradePopUpVisible && !isActivityEnd"
      position="bottom"
      @click-overlay="toggleGradePopUp(false)"
    >
      <van-picker
        :columns="grades"
        @change="onGradeChange"
        @confirm="onGradeConfirm"
        @cancel="onGradeCancel"
        title="年级"
        show-toolbar
      />
    </van-popup>

    <!-- 省市区县选择 -->
    <van-popup
      :show="regionPopupVisible"
      round
      position="bottom"
      :loading="isLoadingSelect"
    >
      <van-cascader
        title="请选择所在地区"
        :value="selectedRegionValue"
        :options="regionOptions"
        active-color="#3646A5"
        :field-names="{ text: 'name', value: 'id' }"
        @change="onRegionChange"
        @finish="onRegionSelectionFinish"
        @close="onRegionPopupClose"
      ></van-cascader>
    </van-popup>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

// service
import ActivityService from "@/service/ActivityService";
import ChildrenService from "@/service/ChildrenService";

// beans
import FormResponse from "@/beans/common/FormResponse";
import SubmitActivityFormField from "@/beans/activity/SubmitActivityFormField";
import SubmitActivityFormRequest from "@/beans/activity/req/SubmitActivityFormRequest";
import ActivityFullItem from "@/beans/activity/ActivityFullItem";
import UserActivityEntryInfo from "@/beans/activity/res/UserActivityEntryInfo";
import UserInfoResponse from "@/beans/common/UserInfoResponse";
import SchoolItem from "@/beans/activity/res/SchoolItem";
import AddChildRequest from "@/beans/children/req/AddChildRequest";

// definition
import ShowMsgEnum from "@/definition/lang/ShowMsgEnum";
import ChannelKeyEnum from "@/definition/common/ChannelKeyEnum";
import PageLinkEnum from "@/definition/lang/PageLinkEnum";
import FormTypeComponentNameMap from "@/definition/common/FormTypeComponentNameMap";
import Grades from "@/definition/common/Grades";
import GradeMap from "@/definition/common/GradeMap";

// management
import ChannelManagement from "@/management/channel/ChannelManagement";

// enums
import FormTypeEnum from "@/enums/common/FormTypeEnum";

// pages
import DynamicFormInput from "./DynamicFormInput.vue";
import DynamicFormUpload from "./DynamicFormUpload.vue";
import DynamicFormCascader from "./DynamicFormCascader.vue";
import DynamicFormCheckbox from "./DynamicFormCheckbox.vue";

// common
import { Utils } from "@/common/utils/Utils";

@Component({
  name: "UpdateEntryInfo",
  components: {
    DynamicFormInput,
    DynamicFormUpload,
    DynamicFormCascader,
    DynamicFormCheckbox,
  },
})
export default class UpdateEntryInfo extends Vue {
  activityService = new ActivityService();
  isTurnOnDistrict: boolean = false;
  isFieldsHidden: boolean = false;
  childId = "";
  activityId = "";
  activityItem: ActivityFullItem = new ActivityFullItem();

  formTypeEnum = FormTypeEnum;

  userActivityEntryInfo: UserActivityEntryInfo = new UserActivityEntryInfo();

  // 省市区县选择
  regionPopupVisible: boolean = false;

  onRegionButtonClick() {
    this.regionPopupVisible = true;
  }
  onRegionChange(e) {
    console.log("e: ", e);

    const { selectedOptions, value: code } = e.detail;

    this.selectedRegionValue = code;

    const selectedOptionsLength = selectedOptions.length;

    if (selectedOptions[selectedOptionsLength - 1]?.children?.length) return;

    const level = (
      parseInt(selectedOptions[selectedOptionsLength - 1].level) + 1
    ).toString();

    switch (level) {
      case "2":
        this.getRegionsByParentId(code, level);
        break;
      case "3":
        const provinceId = selectedOptions[0].id;

        this.getRegionsByParentId(code, level, provinceId);
        break;

      default:
        break;
    }
  }

  isLoadingSelect: boolean = false;
  regionName: string = "";
  regionOptions: any[] = [];
  selectedRegionValue: string = "";
  hasDistricts: boolean = false;

  private async getRegionsByParentId(
    code: string,
    level: string,
    provinceId?: string
  ) {
    this.isLoadingSelect = true;
    try {
      const res = await this.activityService.getPickerList(code);
      const regions = res.data as any[];

      switch (level) {
        case "1":
          this.regionOptions = regions;
          break;
        case "2":
          this.regionOptions.find((item) => item.id === code).children =
            regions;
          break;
        case "3":
          regions.length &&
            (this.regionOptions
              .find((item) => item.id === provinceId)
              .children.find((item) => item.id === code).children = regions);
          this.hasDistricts = Boolean(regions.length);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
    } finally {
      this.isLoadingSelect = false;
    }
  }
  onRegionSelectionFinish(e) {
    console.log("e: ", e);
    this.regionName = e.detail.selectedOptions
      .map((option) => option.text || option.name)
      .join("/");

    const selectedOptionsLength = e.detail.selectedOptions.length;
    const { level, id, name } =
      e.detail.selectedOptions[selectedOptionsLength - 1];

    switch (level) {
      case "1":
        this.provinceCode =
          this.userActivityEntryInfo.provinceCode =
          this.user.provinceCode =
            id;
        this.provinceName =
          this.userActivityEntryInfo.provinceName =
          this.user.provinceName =
            name;
        break;
      case "2":
        this.cityCode =
          this.userActivityEntryInfo.cityCode =
          this.user.cityCode =
            id;
        this.cityName =
          this.userActivityEntryInfo.cityName =
          this.user.cityName =
            name;
        break;
      case "3":
        this.districtCode =
          this.userActivityEntryInfo.districtCode =
          this.user.districtCode =
            id;
        this.districtName =
          this.userActivityEntryInfo.districtName =
          this.user.districtName =
            name;
        break;

      default:
        break;
    }
  }
  onRegionPopupClose() {
    this.regionPopupVisible = false;
  }

  gradeTitle = "";
  gradePopUpVisible = false;
  grades = Grades;

  school: string = "";
  cityCode: string = "";
  districtCode: string = "";
  provinceCode: string = "";
  provinceName: string = "";
  cityName: string = "";
  districtName: string = "";
  isActivityEnd: boolean = false;
  inActivityRange: boolean = false;
  inActivityAgeRange: boolean = false;
  skipEntryForm: boolean = false;
  isNeedPay: boolean = false;
  teamForceCreate: boolean = false;
  teamEnabled: boolean = false;
  isEntry: boolean = false;
  activityName: string = "";
  mustIdNo: boolean = false;

  async onLoad(options: any) {
    this.isTurnOnDistrict = options.isTurnOnDistrict === "true";
    this.isFieldsHidden = options.isFieldsHidden === "true";
    this.childId = options.childId;
    this.activityId = options.activityId;
    if (!this.isFieldsHidden) {
      this.getUserActivityEntryInfo();
      this.isActivityEnd = options.isActivityEnd === "true" ? true : false;
    } else {
      await this.getRegionsByParentId("-1", "1");
      this.getInfo(this.childId);
      this.inActivityRange = options.inActivityRange === "true";
      this.inActivityAgeRange = options.inActivityAgeRange === "true";
      this.skipEntryForm = options.skipEntryForm === "true";
      this.isNeedPay = options.isNeedPay === "true";
      this.teamForceCreate = options.teamForceCreate === "true";
      this.teamEnabled = options.teamEnabled === "true";
      this.isEntry = options.isEntry === "true";
      this.activityName = options.activityName;
    }
    this.mustIdNo = options.mustIdNo === "true";
  }

  mounted() {
    this.getSchool();
    uni.$on("switchSchoolObj", (data) => {
      if (!this.isFieldsHidden) {
        this.userActivityEntryInfo.cityCode = this.cityCode = data.cityCode;
        this.userActivityEntryInfo.provinceCode = this.provinceCode =
          data.provinceCode;
        this.userActivityEntryInfo.districtCode = this.districtCode =
          data.districtCode;
        this.userActivityEntryInfo.cityName = this.cityName = data.cityName;
        this.userActivityEntryInfo.provinceName = this.provinceName =
          data.provinceName;
        this.userActivityEntryInfo.districtName = this.districtName =
          data.districtName;
      }
      this.userActivityEntryInfo.orgName = this.school = data.name;
    });
  }

  schoolObjects: any = [];

  private getSchool() {
    this.activityService.getSchools().then((res) => {
      if (res.success && res.data) {
        this.schoolObjects = res.data;
      }
    });
  }

  getUserActivityEntryInfo() {
    ActivityService.fetchUserEntryInfo(
      this.activityId,
      this.childId,
      this.ongetUserActivityEntryInfoCallback
    );
  }

  ongetUserActivityEntryInfoCallback(
    success: boolean,
    userActivityEntryInfo: UserActivityEntryInfo
  ) {
    if (success && userActivityEntryInfo) {
      this.userActivityEntryInfo = userActivityEntryInfo;
      this.school = this.userActivityEntryInfo.orgName;
      this.cityCode = this.userActivityEntryInfo.cityCode;
      this.districtCode = userActivityEntryInfo.districtCode;
      this.provinceCode = this.userActivityEntryInfo.provinceCode;
      this.provinceName = this.userActivityEntryInfo.provinceName;
      this.cityName = this.userActivityEntryInfo.cityName;
      this.districtName = this.userActivityEntryInfo.districtName;
      this.gradeTitle = this.getGradeTitle(userActivityEntryInfo.grade);
    }
  }

  isValidForms(forms: Array<FormResponse>): boolean {
    // 循环遍历表单this.forms，如果有必填项没有填写，就提示用户；如果都填写了，就返回true，否则返回false；如果表单项中有type为FormTypeEnum.INPUT的，并且validPattern不为空字符串，就需要校验表单项的值是否符合正则表达式
    let result = true;
    console.log("forms", forms);
    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      if (form.required && form.value === "") {
        uni.showToast({
          title: form.name + "不能为空",
          icon: "none",
        });
        result = false;
        break;
      }
      if (
        form.required &&
        form.type === FormTypeEnum.INPUT &&
        form.validPattern !== ""
      ) {
        const reg = new RegExp(form.validPattern);
        if (!reg.test(form.value)) {
          uni.showToast({
            title: "请输入正确的" + form.name,
            icon: "none",
          });
          result = false;
          break;
        }
      }
    }
    return result;
  }
  private getSchoolId(name: string) {
    const matchedSchool = this.schoolObjects.filter(
      (item: SchoolItem) => item.name === name
    );

    return matchedSchool.length ? matchedSchool[0].id : "";
  }
  submit() {
    if (!this.isFieldsHidden) {
      // 新增身份证号校验，至少6位
      if (
        this.mustIdNo &&
        (!this.userActivityEntryInfo.idNo ||
          this.userActivityEntryInfo.idNo.length < 6)
      ) {
        uni.showToast({ title: "请输入正确的证件号", icon: "none" });
        return;
      }

      if (!this.isValidForms(this.userActivityEntryInfo.fields)) return;
      this.userActivityEntryInfo.orgCode = this.getSchoolId(this.school) || -1;
      ActivityService.updateUserEntryInfo(
        this.activityId,
        this.childId,
        this.userActivityEntryInfo,
        this.onSubmitCallback
      );
    } else {
      if (
        this.isTurnOnDistrict &&
        (!this.provinceCode ||
          !this.cityCode ||
          (this.hasDistricts && !this.districtCode))
      ) {
        uni.showToast({
          title: "请先选择地区",
          icon: "none",
          position: "center",
        });
        return;
      }

      // 新增身份证号校验，至少6位
      if (
        this.mustIdNo &&
        (!this.userActivityEntryInfo.idNo ||
          this.userActivityEntryInfo.idNo.length < 6)
      ) {
        uni.showToast({ title: "请输入正确的证件号", icon: "none" });
        return;
      }

      const requestData = new AddChildRequest();

      delete requestData.avatar;
      delete requestData.gender;
      delete requestData.kocId;
      Utils.mergeObjects(requestData, this.user);
      this.userActivityEntryInfo.orgCode = this.getSchoolId(this.school) || -1;
      Utils.mergeObjects(requestData, this.userActivityEntryInfo);
      this.childrenService
        .editChildInfo(this.childId, requestData)
        .then((res) => {
          if (res.success) {
            this.doReadAction();
          } else {
            uni.showToast({
              title: res.error,
              duration: 2000,
              icon: "none",
            });
          }
        });
    }
  }

  onSubmitCallback(success: boolean, errorMsg: string) {
    if (success) {
      this.showSubmitSuccessNotice();
      setTimeout(() => {
        this.back();
      }, ShowMsgEnum.SHOW_MESSAGE_DURATION);
    } else {
      this.showSubmitErrorNotice(errorMsg);
    }
  }

  back() {
    uni.navigateBack({
      delta: 1,
    });
  }

  showSubmitSuccessNotice() {
    uni.showToast({
      title: "更新成功",
      duration: ShowMsgEnum.SHOW_SUBMIT_DURATION_SUCCESS,
      icon: "none",
    });
  }

  showSubmitErrorNotice(errorMsg: string) {
    uni.showToast({
      title: errorMsg,
      duration: 2000,
      icon: "none",
    });
  }
  private doReadAction() {
    if (this.inActivityRange && this.inActivityAgeRange) {
      this.isEntry && this.onDetermineChooseAfter();
      !this.skipEntryForm
        ? this.moveToFillInfoPage()
        : this.onDetermineChooseAfter();
    }
  }
  private moveToFillInfoPage() {
    uni.redirectTo({
      url: `/pages/fillInfo/ActivityEntryExt?isNeedPay=${this.isNeedPay}&teamForceCreate=${this.teamForceCreate}&teamEnabled=${this.teamEnabled}&childId=${this.childId}&activityId=${this.activityId}&isEntry=${this.isEntry}`,
    });
  }
  private onDetermineChooseAfter() {
    if (this.teamForceCreate && this.teamEnabled) {
      this.moveToCreateTeamPage();
    } else {
      this.signUpActivity();
    }
  }
  private moveToCreateTeamPage() {
    uni.redirectTo({
      url: `/pages/create-team/CreateTeam?isNeedPay=${this.isNeedPay}&childId=${this.childId}&activityId=${this.activityId}`,
    });
  }
  private signUpActivity() {
    const entryActivityRequest = new SubmitActivityFormRequest();

    entryActivityRequest.subUserId = this.childId;
    entryActivityRequest.preview = "0";
    entryActivityRequest.entryWay = "4";
    if (ChannelManagement.getChannelId(ChannelKeyEnum.KOC) !== "") {
      entryActivityRequest.kocId = ChannelManagement.getChannelId(
        ChannelKeyEnum.KOC
      );
    }
    new ActivityService()
      .submitActivityForm(
        this.activityId,
        entryActivityRequest,
        this.activityName
      )
      .then((res) => {
        if (res.success && res.data) {
          this.moveToNextPage();
        } else {
          this.showSignUpErrorNotice(res.error);
        }
      });
  }
  private moveToNextPage() {
    this.isNeedPay ? this.moveToPlaceAnOrderPage() : this.moveToGuidePage();
  }
  private moveToPlaceAnOrderPage() {
    uni.redirectTo({
      url: `${PageLinkEnum.PLACE_AN_ORDER}?activityId=${this.activityId}&childId=${this.childId}`,
    });
  }
  private moveToGuidePage() {
    uni.redirectTo({
      url: `/pages/guide/index?activityId=${this.activityId}&childId=${this.childId}`,
    });
  }
  private showSignUpErrorNotice(errorMsg: string) {
    uni.showToast({
      title: errorMsg,
      duration: 2000,
      icon: "none",
    });
  }

  onFormChange(form: FormResponse, event: any) {
    form.value = event;
  }

  toSelectSchool() {
    if (!this.isActivityEnd) {
      uni.navigateTo({
        url: `/pages/selectSchool/index?schoolName=${this.school}&cityCode=${this.cityCode}&districtCode=${this.districtCode}&provinceCode=${this.provinceCode}&provinceName=${this.provinceName}&cityName=${this.cityName}&districtName=${this.districtName}&isFieldsHidden=${this.isFieldsHidden}`,
      });
    } else {
      uni.showToast({
        title: "很抱歉，活动已结束，不可修改",
        icon: "none",
      });
    }
  }

  onGradeChange(event: any) {
    // todo
  }

  onGradeConfirm(event: any) {
    const value = event.detail.value;
    this.gradeTitle = value;
    this.userActivityEntryInfo.grade = this.getGrade(this.gradeTitle);
    this.toggleGradePopUp(false);
  }

  toggleGradePopUp(visible: boolean) {
    if (this.isActivityEnd) {
      uni.showToast({
        title: "很抱歉，活动已结束，不可修改",
        icon: "none",
      });
    }
    this.gradePopUpVisible = visible;
  }

  getGradeTitle(grade: number): string {
    let gradeTitle = "";
    Object.keys(GradeMap).forEach((key) => {
      if (GradeMap[key] === grade) {
        gradeTitle = key;
      }
    });
    return gradeTitle;
  }

  private childrenService: ChildrenService = new ChildrenService();
  user: UserInfoResponse = new UserInfoResponse();

  private getInfo(id: string) {
    this.childrenService.getChildInfo(id).then(async (res) => {
      if (res.success && res.data) {
        // this.user = res.data;
        Utils.mergeObjects(this.user, res.data);
        Utils.mergeObjects(this.userActivityEntryInfo, this.user);
        this.school = this.userActivityEntryInfo.orgName;
        this.cityCode = this.userActivityEntryInfo.cityCode;
        this.districtCode = this.userActivityEntryInfo.districtCode;
        this.provinceCode = this.userActivityEntryInfo.provinceCode;
        this.provinceName = this.userActivityEntryInfo.provinceName;
        if (this.provinceCode) {
          this.regionName = this.provinceName;
          this.selectedRegionValue = this.provinceCode;
          await this.getRegionsByParentId(this.provinceCode, "2");
        }
        this.cityName = this.userActivityEntryInfo.cityName;
        if (this.cityCode) {
          this.regionName += `/${this.cityName}`;
          this.selectedRegionValue = this.cityCode;
          await this.getRegionsByParentId(
            this.cityCode,
            "3",
            this.provinceCode
          );
        }
        this.districtName = this.userActivityEntryInfo.districtName;
        if (this.districtCode) {
          this.regionName += `/${this.districtName}`;
          this.selectedRegionValue = this.districtCode;
        }
        this.gradeTitle = this.getGradeTitle(this.userActivityEntryInfo.grade);
      }
    });
  }

  getGrade(gradeTitle: string): number {
    let grade = 1;
    Object.keys(GradeMap).forEach((key) => {
      if (key === gradeTitle) {
        grade = GradeMap[key];
      }
    });
    return grade;
  }

  onGradeCancel() {
    this.toggleGradePopUp(false);
  }
}
</script>
<style>
@import "@/css/iconfont.css";
page {
  background: #fff;
}
</style>

<style lang="scss" scoped>
.page {
  padding: 40rpx 60rpx;
  box-sizing: border-box;
  min-height: 100%;
  background: url("https://contentdevsa-blob.ai121.net/testcontainer/activity/image/a5313504-927a-430a-95cb-76d6cec0b7ce.png")
    no-repeat center bottom/contain;
}

.title {
  color: #8b0303;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.text {
  color: #969393;
  font-size: 28rpx;
  margin-bottom: 40rpx;
}

.form-row {
  display: flex;
  flex-direction: column;
  .notice {
    padding: 30rpx 0 0 0;
    font-size: 36rpx;
  }
  .filed {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #efefef;
  }
}

.btn-box {
  display: flex;
  flex-direction: row;
}

.submit-btn {
  width: 80%;
  background: #7563f0;
  border-radius: 10rpx;
  color: #fff;
  font-size: 32rpx;
  margin-top: 80rpx;
  padding: 30rpx 20rpx;
  text-align: center;
}

.submit-btn:last-child {
  margin-left: 50rpx;
}

.tip {
  color: #f2a563;
  font-size: 30rpx;
  margin: 20rpx;
}

.avatar-box {
  width: 200rpx;
  height: 200rpx;
  // border-radius: 50%;
  background: #89888e;
  // margin-top: 20rpx;
  // margin-right: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  color: #fff;
}

// preview-box充满父容器并居中
.preview-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-img {
  width: 100%;
  height: 100%;
  // border-radius: 50%;
  object-fit: cover;
  position: absolute;
}

.upload-box {
  opacity: 0;
}

.preview-icon {
  position: absolute;
  bottom: 16rpx;
  right: 10rpx;
}

// avatar-item充满父容器并居中
.avatar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

// child-img生成样式，avatar-box、notice-box左右排列
.child-img {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20rpx;
}

// 生成.notice-box位于avatar-box的右侧，高度与avatar-box相同。.notice-box的子容器notice，字体大小为15rpx，颜色为灰色，文字能换行
.child-img-notice-box {
  margin-left: 20rpx;
  height: 100%;
  .child-img-notice {
    font-size: 20rpx;
    color: #8b0303;
    white-space: pre-wrap;
    padding: 10rpx;
  }
}
</style>
