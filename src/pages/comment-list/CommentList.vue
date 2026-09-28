<template>
  <div class="user_comment">
    <div
      v-for="(production, index) in productionPublishedList"
      :key="index"
      class="comment_body"
    >
      <div class="user_info flex">
        <div class="avatar">
          <img :src="production.user.avatar" alt="" />
        </div>
        <div class="user_describe">
          <div class="name_scool">
            <div class="name">
              {{ production.user.realName }}
            </div>
            <div class="grade_name">{{ production.user.gradeName }}</div>
          </div>
          <div class="grade_name_time">
            <span class="scool_name">{{ production.user.orgName }}</span>
            <span class="time">{{ production.time }}</span>
          </div>
        </div>
      </div>
      <div class="comment_describe">
        {{
          production.description.length > 0 ? production.description : "--"
        }}
      </div>

      <van-grid :column-num="3" :border="false" v-if="production.showPic">
        <van-grid-item use-slot v-for="(file, i) in production.files" :key="i">
          <image
            style="width: 100%; height: 90px"
            :src="file.fileUrl"
            mode="widthFix"
            @click="previewImg(file.fileUrl,production.files)"
            :data-src="file.fileUrl"
          />
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ProductionPublishedItemVO from "@/beans/activity/productionPublished/vo/ProductionPublishedItemVO";
import ProductionPublishedListDTO from "@/beans/activity/productionPublished/dto/ProductionPublishedListDTO";
import ActivityService from "@/service/ActivityService";
import { Utils } from "@/common/utils/Utils";
import ProductionPublishedListVO from "@/beans/activity/productionPublished/vo/ProductionPublishedListVO";
import ShowNoticeManagement from "@/management/common/ShowNoticeManagement";
import ProductionItemVO from "@/beans/activity/productionPublished/vo/ProductionItemVO";

@Component({
  name: "CommentList"
})
export default class CommentList extends Vue {
  activityId: string = "";
  productionPublishedCurrentPage: number = 1;
  productionPublishedTotalPage: number = 0;
  productionPublishedList: Array<ProductionPublishedItemVO> = [];
  productionPublishedListDTO: ProductionPublishedListDTO = new ProductionPublishedListDTO();

  onLoad(options) {
    console.log("hahah ", options);

    this.activityId = options.activityId;
    this.fetchProductionPublishedList();
  }

  fetchProductionPublishedList() {
    this.productionPublishedListDTO.activityId = this.activityId;
    this.productionPublishedListDTO.pageNo = this.productionPublishedCurrentPage;
    ActivityService.fetchProductionPublishedList(
      this.productionPublishedListDTO,
      this.fetchProductionPublishedListCallback
    );
  }

  fetchProductionPublishedListCallback(
    success: boolean,
    productionPublishedListVO: ProductionPublishedListVO
  ) {
    if (success) {
      this.productionPublishedCurrentPage =
        productionPublishedListVO.currentPage;
      this.productionPublishedTotalPage = productionPublishedListVO.pages;
      this.productionPublishedList = Utils.getReachBottomPagingList(
        this.productionPublishedCurrentPage,
        this.productionPublishedTotalPage,
        this.productionPublishedList,
        productionPublishedListVO.records
      );
    }
  }

  previewImg(currentUrl:string, files:Array<ProductionItemVO>) {
    let urls = []
    files.forEach(item => {
      urls.push(item.fileUrl)
    })
    wx.previewImage({
      current: currentUrl,
      urls: urls
    })
  }

  onReachBottom() {
    if (
      this.productionPublishedCurrentPage < this.productionPublishedTotalPage
    ) {
      this.productionPublishedCurrentPage++;
      this.fetchProductionPublishedList();
    } else {
      ShowNoticeManagement.ShowErrorNotice("已经到底部了");
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}

.user_comment {
  padding: 4vw;
  box-sizing: border-box;
  width: 100vw;
  .title {
    justify-content: space-between;

    .load_more {
      color: #999999;
      font-size: 24rpx;
    }
  }
  .comment_body {
    margin: 4vh 0vh;
    font-size: 1em;
    width: 100%;
    .user_info {
      color: #999999;
      font-size: 24rpx;
      .avatar {
        width: 12vw;
        height: 12vw;
        min-width: 12vw;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100vw;
        }
      }
      .user_describe {
        flex: 1;
        // padding: 0vh 2vh;
        padding-left: 4vw;
        .name_scool {
          display: flex;
          // align-items: center;
          // justify-content: space-between;
          .name {
            word-break: keep-all;
            white-space: nowrap;
          }
          .grade_name {
            word-break: keep-all;
            white-space: nowrap;
            padding-left: 4vw;
          }
        }
        .grade_name_time {
          display: flex;
          flex-direction: column;
          // align-items: center;
          // justify-content: space-between;
          .scool_name {
            // padding-right: 4vw;
            white-space:nowrap; 
            overflow:hidden; text-overflow:ellipsis;
            width: 76vw;
          }
          .time {
            word-break: keep-all;
            white-space: nowrap;
          }
        }
      }
    }
    .comment_describe {
      margin: 20rpx 0rpx;
    }
    .comment_img {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-content: space-around;
      .works {
        width: 25vw;
        margin: 10rpx 0rpx;
      }
    }
  }
}
</style>