<template>
  <view class="page">
    <view class="profile-box">
      <view class="edit-row">
        <view class="edit-btn" @click="goEditonfo" >
          <van-icon name="edit" class="edit-ai121" />
        </view>
      </view>
      <view class="avatar-box">
        <view class="preview-box">
          <image class="preview-img" :src="previewImage"></image>
          <!-- <view class="upload-box">
            <van-uploader
              :file-list="fileList"
              @after-read="afterRead"
              class="avatar-item"
            />
          </view> -->
          <!-- <view class="preview-icon">
            <van-icon name="edit" />
          </view> -->
        </view>
        <!-- <view class="avatar-label">上传头像</view> -->
      </view>
      <view class="form-box" v-if="!uiHidden">
        <view class="form-title">基本信息</view>
        <!-- <van-cell title="姓名" :value="name" />
        <van-cell title="学校" :value="school" />
        <van-cell title="年纪" :value="grade" />
        <van-cell title="出生日期" :value="birthday" />
        <van-cell title="活动身份" :value="role" /> -->
        <van-field label="姓名" :value="name" :border="false" disabled />
        <van-field label="学校" :value="school" :border="false" disabled />
        <van-field label="年级" :value="grade" :border="false" disabled />
        <!-- <van-field
          label="出生日期"
          :value="birthday"
          :border="false"
          disabled
        /> -->
        <van-field label="活动身份" :value="role" :border="false" disabled />
      </view>
      <view v-else style="text-align: center">暂时无法编辑</view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChildrenService from "@/service/ChildrenService";
import GradeMap from "@/definition/common/GradeMap";
import RoleMap from "@/definition/common/RoleMap";
import dayjs from "dayjs";
import UserInfoResponse from "@/beans/common/UserInfoResponse";
import BlobService from "@/service/BlobService";
import UploadFileResponse from "@/beans/blob/res/UploadFileResponse";
import AddChildRequest from "@/beans/children/req/AddChildRequest";
import { getUUID } from "@/utils/Weapon";
import LangEnum from '@/definition/lang/LangEnum'
import WriteFillChildrenInfo from '@/pages/fillChildInfo/index.vue'

@Component({
  name: "ChildrenSetting",
  components: {
    WriteFillChildrenInfo
  },
})
export default class ChildrenSetting extends Vue {
  blobService = new BlobService();
  userId = "";
  childrenService = new ChildrenService();
  fileList = [];
  openFaceRecognition = false;
  uiHidden: boolean = false
  name = "";
  school = "";
  grade = "";
  birthday = "";
  role = "";
  previewImage = "";

  onLoad(options: any = {}) {
    const id = options.id;
    this.userId = id;
    this.getInfo(id);
    this.watchEvents()
  }

  mounted () {
    if (uni.getStorageSync(LangEnum.IS_HIDDEN_KEY)) {
      this.uiHidden = true
    }else {
      this.uiHidden = false
    }
  }

  // 下拉刷新
  onPullDownRefresh() {
    setTimeout(() => {
      this.getInfo(this.userId);
      uni.stopPullDownRefresh();
    }, 3000);
  }

  watchEvents() {
    uni.$on("editChild", () => {
      this.getInfo(this.userId);
    });
  }

  getInfo(id: string) {
    this.childrenService.getChildInfo(id).then((res) => {
      if (res.success && res.data) {
        const user: UserInfoResponse = res.data;
        this.name = user.realName;
        this.school = user.orgName;
        this.grade = this.getGradeTitle(Number(user.grade));
        this.birthday = dayjs(Number(user.birthday)).format("YYYY-MM-DD");
        this.role = RoleMap[user.ident];
        this.previewImage = user.avatar;
      }
    });
  }

  onFaceRecognitionChange(event: any) {
    const state = event.detail;
    this.openFaceRecognition = state;
  }

  afterRead(event: any) {
    const { file } = event.detail;
    const suffix = file.url.split(".").pop();
    const blobDir = "ucenter/image";
    const blobName = `${getUUID()}.${suffix}`;
    this.blobService
      .upLoadFile(file.url, blobDir, blobName)
      .then((res: UploadFileResponse) => {
        if (res.success && res.data) {
          const avatar = res.data;
          this.previewImage = avatar;
          this.submitAvatar(avatar);
        }
      })
      .catch(() => {
        uni.showToast({
          title: "上传失败，请稍后重试",
          duration: 2000,
          icon: "none",
        });
      });
  }

  goEditonfo() {
      uni.navigateTo({
        url: `/pages/editInfo/index?id=${this.userId}`,
      })
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

  submitAvatar(avatar: string) {
    const requestData = new AddChildRequest();
    requestData.avatar = avatar;

    this.childrenService
      .editChildInfo(this.userId, requestData)
      .then((res) => {
        if (res.success && res.data) {
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
      .catch(() => {
        uni.showToast({
          title: "上传失败，请稍后重试",
          duration: 2000,
          icon: "none",
        });
      });
  }
}
</script>
<style>
.page .van-uploader__upload {
  border-radius: 50%;
  margin: 0;
}
</style>
<style scoped>
.page {
  padding: 40rpx;
}

.profile-box {
  padding: 30rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  margin-bottom: 60rpx;
}

.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-label {
  color: #888888;
  font-size: 30rpx;
  margin-top: 20rpx;
}

.form-title {
  font-size: 36rpx;
  color: #888888;
  padding: 30rpx 20rpx;
}

.switch-row {
  display: flex;
  align-items: center;
}

.switch-label {
  font-size: 32rpx;
  color: #c8c9cc;
}

.switch-item {
  margin-left: auto;
}

.submit-btn {
  margin-top: 60rpx;
  color: #fff;
  background: #8ac252;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 32rpx;
}

.edit-row {
  display: flex;
  justify-content: flex-end;
}

.edit-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-box {
  width: 200rpx;
  height: 200rpx;
  position: relative;
  margin-bottom: 20rpx;
}

.preview-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
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
.edit-ai121 >>> .van-icon {
  font-size: 40rpx;
}
</style>
