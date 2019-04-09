<template>
    <div class="operate-spugoods-detailspu">
        <v-modal
        class="modal-whole"
        :width="600"
        title="SPU商品详情"
        :visible="detailVisible"
        @ok="handleClose"
        @cancel="handleClose"
        >
            <v-content>
                <div>     <!--表格内容-->
                    <div class="data-gird" :style="`height:${gridHeight};margin-bottom:10px;width:100%;`">
                        <v-data-table
                            :data="getData"
                            :columns="columns"
                            ref="successList"
                        >
                             <template slot="td" slot-scope="props">
                                <div v-if="props.column.field=='photo'">
                                    <img :src="props.content" style="width:50px;height:50px" alt>
                                </div>
                                <div v-else-if="props.column.field=='status'">
                                    <div v-if="props.item.status=='0'">
                                        <span class="text-success">在售</span>
                                    </div>
                                    <div v-if="props.item.status=='1'">
                                        <span>下线</span>
                                    </div>
                                    <div v-if="props.item.status=='2'">
                                        <span style="color:red">下架</span>
                                    </div>
                                </div>
                                <span v-else v-html="props.content"></span>
                             </template>
                        </v-data-table>
                    </div>
                </div>
            </v-content>
        </v-modal>
    </div>
</template>

<script>
import api from "../api.js";
import transform from "@/util/transform.js";
export default {
     props: {
        detailVisible: Boolean,
        spuDatailId: String
    },
    data(){
        return{
            showable: true,
            gridHeight: "280px",
            columns:[],
            currentPage: 1,//当前页
            numsPerPage: 10,//条数
        }
    },
    created(){
        this.showable = this.detailVisible;

        this.columns = [
            { title: "SKUID", field: "skuErp" },
            { title: "商品图", field:'photo'},
            { title: "商品中文名",field:'skuName'},
            { title: "状态",field:'status'}
        ]    
    },
    methods: {
        handleClose() {
            this.$emit("changeBul", false);
        },
        getData() {
            var _this = this;
            return _this.$http
                .get(api.getGoodsBySpuStatus, {
                params: {
                    spuList: _this.spuDatailId,
                    currentPage: _this.currentPage,
                    numsPerPage: _this.numsPerPage
                }
            }).then(res =>{
                    console.log("1",Boolean(null))
                    console.log(res.data);
                    let result = transform.getDataTable({
                        items: res.data.items[0].skuInfos,
                        //totalCount: res.data.count
                    });
                    return result;
                }
            )
        }
    }

}
</script>
<style src="./detailspu.less" lang="less"> 

</style>

