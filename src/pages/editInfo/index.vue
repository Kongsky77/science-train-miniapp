<template>
  <view class="page">
    <view class="title">编辑信息</view>
    <view class="text">请编辑用户的信息！</view>
    <view class="form-list"  v-if="!uiHidden">
      <!-- <view class="form-row">
        <van-icon
          class-prefix="iconfont"
          name="iconfont icon-name"
          color="#929292"
        />
        <van-field
          :value="name"
          placeholder="请输入用户名"
          :border="false"
          @change="onNameChange"
          disabled
        />
      </view> -->
      <view class="form-row" @click="selectSchool()">
        <van-icon
          class-prefix="iconfont"
          name="iconfont icon-shcool"
          color="#929292"
        />
        <van-field
          class="van-cell-ai121"
          :value="school"
          readonly
          placeholder="选择学校，若无法找到，手动输入后点确定"
          :border="false"
        />
      </view>
      <view class="form-row" @click="toggleGradePopUp(true)">
        <van-icon
          class-prefix="iconfont"
          name="iconfont icon-class"
          color="#929292"
        />
        <view class="form-text" :class="{ active: gradeSelected }">{{
          gradeTitle
        }}</view>
      </view>
      <!-- <view class="form-row" @click="toggleDatePopup(true)">
        <van-icon
          class-prefix="iconfont"
          name="iconfont icon-date"
          color="#929292"
        />
        <view class="form-text" :class="{ active: dateSelected }">{{
          dateTitle
        }}</view>
      </view> -->
      <!-- <view class="form-row" @click="toggleRolePopup(true)">
        <van-icon name="comment-o" />
        <view class="form-text">选择活动身份</view>
      </view> -->
    </view>
    <view class="submit-btn"  v-if="!uiHidden" @click="submit"> 保存信息 </view>
    <view class="bottom-tip"  v-if="!uiHidden">
      温馨提示：未填写真实信息会影响孩子证书发放
    </view>
    <view class="bottom-tip"  v-else>
      温馨提示：暂时无法编辑
    </view>
    <van-popup
      :show="gradePopUpVisible"
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
    <van-popup
      :show="datePopUpVisible"
      position="bottom"
      @click-overlay="toggleDatePopup(false)"
    >
      <van-datetime-picker
        type="date"
        :min-date="minDate"
        :value="date"
        @confirm="onDateConfirm"
        @change="onDateChange"
        @cancel="onDateCancel"
      />
    </van-popup>
    <van-popup
      :show="rolePopUpVisible"
      position="bottom"
      @click-overlay="toggleRolePopup(false)"
    >
      <van-picker
        :columns="roles"
        @change="onRoleChange"
        show-toolbar
        @confirm="onRoleConfirm"
      />
    </van-popup>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import dayjs from "dayjs";
import ActivityService from "@/service/ActivityService";
import SchoolItem from "@/beans/activity/res/SchoolItem";
import RoleEnum from "@/enums/common/RoleEnum";
import GradeMap from "@/definition/common/GradeMap";
import ChildrenService from "@/service/ChildrenService";
import UserInfoResponse from "@/beans/common/UserInfoResponse";
import AddChildRequest from "@/beans/children/req/AddChildRequest";
import Grades from "@/definition/common/Grades";
import Roles from "@/definition/common/Roles";
import LangEnum from '@/definition/lang/LangEnum'

@Component({
  name: "FillInfo",
  components: {},
})
export default class FillInfo extends Vue {
  userId = "";
  activityService = new ActivityService();
  childrenService = new ChildrenService();
  gradePopUpVisible = false;
  datePopUpVisible = false;
  rolePopUpVisible = false;
  name = "";
  school = "";
  uiHidden = false
  grade = "";
  date = new Date().getTime();
  role = "";
  areaInfo = {
    districtCode:'',
    cityCode:'',
    provinceCode:'',
    cityName:'',
    provinceName:'',
    districtName:'',
  }

  // 需要手动控制文案和高亮状态
  gradeTitle = "年级：非必填，可忽略";
  dateTitle = "请选择出生日期";
  gradeSelected = false;
  dateSelected = false;

  schoolObjects: any = [];
  schools: Array<string> = [];
  grades = Grades;
  roles = Roles;

  currentDate = new Date().getTime();
  minDate = new Date("2000 /01/01").getTime();

  mounted() {
    this.getSchool();

    if (uni.getStorageSync(LangEnum.IS_HIDDEN_KEY)) {
      this.uiHidden = true
    }else {
      this.uiHidden = false
    }

    uni.$on("switchSchool", (data) => {
      const school = data.name;
      this.school = school.replace(/\s*/g, "");
      this.areaInfo = {
        districtCode:data.districtCode,
        cityCode:data.cityCode,
        provinceCode:data.provinceCode,
        provinceName:data.provinceName,
        cityName:data.cityName,
        districtName:data.districtName
      }
    })


  }

  onLoad(options: any) {
    const id = options.id;
    this.userId = id;
    this.getInfo(id);
  }

  // 下拉刷新
  onPullDownRefresh() {
    console.log(1111111);
    setTimeout(() => {
      console.log(1111111);
      this.getInfo(this.userId);
      this.getSchool();
      uni.stopPullDownRefresh();
    }, 3000);
  }

  toggleDatePopup(visible: boolean) {
    this.datePopUpVisible = visible;
  }

  toggleGradePopUp(visible: boolean) {
    this.gradePopUpVisible = visible;
  }

  toggleRolePopup(visible: boolean) {
    this.rolePopUpVisible = visible;
  }

  onNameChange(event: any) {
    console.log(event);
    this.name = event.detail;
  }

  onSchoolChange(event: any) {
    console.log(event);
    this.school = event.detail;
  }

  onGradeChange(event: any) {
    console.log(event);
    this.grade = event.detail;
  }

  onGradeConfirm(event: any) {
    const value = event.detail.value;
    this.grade = value;
    this.gradeTitle = value;
    this.gradeSelected = true;
    this.toggleGradePopUp(false);
  }

  onDateConfirm(event: any) {
    const value = event.detail;
    this.date = value;
    this.dateTitle = dayjs(Number(value)).format("YYYY-MM-DD");
    this.dateSelected = true;
    this.toggleDatePopup(false);
  }

  onDateCancel() {
    // console.log(1111);
    this.toggleDatePopup(false);
  }

  onDateChange(event: any) {
    console.log(event);
    // this.date = event.detail;
    console.log("这里是为了测试时间改变时的date值", this.date);
  }

  onRoleChange(event: any) {
    console.log(event);
    this.role = event.detail;
  }

  onRoleConfirm(event: any) {
    console.log(event);
    this.role = event.detail;
  }

  getSchool() {
    this.activityService.getSchools().then((res) => {
      if (res.success && res.data) {
        this.schoolObjects = res.data;
        const schools = res.data.map((item) => item.name);
        this.schools = schools;
      }
    });
  }

  getSchoolId(name: string) {
    const matchedSchool = this.schoolObjects.filter(
      (item: SchoolItem) => item.name === name
    );
    if (matchedSchool.length) {
      return matchedSchool[0].id;
    } else {
      return "";
    }
  }

  submit() {
    console.log("这里时为了测试date的数据类型", this.date);

    const form: any = {
      realName: this.name,
      grade:GradeMap[this.grade],
      birthday: this.date,
      ...this.areaInfo,
      role: RoleEnum.STUDENT,
      orgCode: this.getSchoolId(this.school) || -1,
    };

    const isAllFilled = Object.keys(form).every((key) => {
      return form[key] !== "";
    });

    if (!isAllFilled || this.school === "") {
      uni.showToast({
        title: "请填写完整信息哦",
        duration: 2000,
        icon: "none",
      });
      return;
    }

    console.log("form");
    console.log(form);

    const requestData: AddChildRequest = {
      birthday: form.birthday,
      realName: form.realName,
      grade: form.grade,
      ident: form.ident,
      orgCode: form.orgCode,
      cityCode:form.cityCode,
      cityName: form.cityName,
      provinceCode: form.provinceCode,
      provinceName: form.provinceName,
      districtCode: form.districtCode,
      districtName: form.districtName,
      referer: process.env.VUE_APP_PROJECT_NAME,
      orgName: "",
    };
    if (form.orgCode === -1) {
      requestData.orgName = this.school;
    }

    console.log(
      "这里是为了测试form表单里的数据类型",
      requestData.orgName,
      "+",
      requestData.orgCode,
      "+",
      requestData
    );

    console.log("这里是为了测试form表单里的数据类型", requestData.birthday);

    this.childrenService
      .editChildInfo(this.userId, requestData)
      .then((res) => {
        console.log(res);
        if (res.success && res.data) {
          uni.navigateBack({
            delta: 1,
          });
          uni.$emit("editChild");
        } else {
          const error = res.error;
          uni.showToast({
            title: error,
            duration: 2000,
            icon: "none",
          });
        }
      })
      .catch();
  }

  getInfo(id: string) {
    this.childrenService.getChildInfo(id).then((res) => {
      console.log(res.data);
      if (res.success && res.data) {
        const user: UserInfoResponse = res.data;
        this.name = user.realName;
        this.school = user.orgName;
        this.areaInfo={
            districtCode:user.districtCode,
            cityCode:user.cityCode,
            provinceCode:user.provinceCode,
            provinceName:user.provinceName,
            cityName:user.cityName,
            districtName:user.districtName
        }
        this.grade = this.getGradeTitle(Number(user.grade));
        this.date = user.birthday;
        this.role = user.ident;

        // 更新选择框文本
        this.gradeTitle = this.getGradeTitle(Number(user.grade));
        this.dateTitle = dayjs(Number(user.birthday)).format("YYYY-MM-DD");

        // 高亮时间和年纪输入框
        this.gradeSelected = true;
        this.dateSelected = true;
      }
    });
  }

  getGradeTitle(grade: number) {
    let gradeTitle = "";
    Object.keys(GradeMap).forEach((key) => {
      if (GradeMap[key] === grade) {
        gradeTitle = key;
      }
    });

    return gradeTitle;
  }
  selectSchool() {
    uni.navigateTo({
      url: `/pages/selectSchool/index?schoolName=${this.school}&cityCode=${this.areaInfo.cityCode}&districtCode=${this.areaInfo.districtCode}&provinceCode=${this.areaInfo.provinceCode}&provinceName=${this.areaInfo.provinceName}&cityName=${this.areaInfo.cityName}&districtName=${this.areaInfo.districtName}`,
    });
  }

  onGradeCancel() {
    this.toggleGradePopUp(false);
  }
}
</script>
<style lang="scss">
@import "@/css/iconfont.css";
page {
  background: #fff;
}
</style>
<style lang="scss" scoped>
.page {
  padding: 40rpx 60rpx;
  height: 100%;
  box-sizing: border-box;
  background: url("https://contentdevsa-blob.ai121.net/testcontainer/activity/image/a5313504-927a-430a-95cb-76d6cec0b7ce.png") no-repeat center
    bottom/contain;
}

.title {
  color: #969393;
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.text {
  color: #969393;
  font-size: 28rpx;
  margin-bottom: 40rpx;
}

.form-row {
  display: flex;
  padding: 20rpx;
  border-bottom: 1px solid #efefef;
  height: 80rpx;
  align-items: center;
}

.van-cell-ai121 /deep/ .van-cell {
  width: 150% !important;
}

.van-field-ai121 /deep/ .van-field__control {
  width: 150% !important;
}

.form-text {
  color: #c8c9cc;
  margin-left: 42rpx;
  font-size: 32rpx;
}

.form-text.active {
  color: #000;
}

.school-select {
  padding: 0 20rpx;
  padding-left: 40rpx;
  flex: 1;
}

.submit-btn {
  margin-top: 60rpx;
  color: #fff;
  background: $ai121-theme-color;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 32rpx;
}

.bottom-tip {
  color: #888888;
  font-size: 24rpx;
  text-align: center;
  margin-top: 40rpx;
}
</style>
