<template>
  <div style="background-color: #545c64;height: 670px;border-top: 1px solid white">
    <div id="myChart" :style="{width: '700px', height: '400px',margin:'100px auto'}"></div>
  </div>

</template>

<script>
    export default {
        name: "Home",
      data(){
          return{
            msg: 'Welcome to Your Vue.js App'
          }
      },
      mounted() {
        this.drawLine();
      },
      methods:{
        drawLine(){
          let myChart = this.$echarts.init(document.getElementById('myChart'))
          myChart.setOption({
            title: { text: '在Vue中使用echarts' },
            tooltip: {},
            xAxis: {
              data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }]
          });
        }
      }
    }
</script>

<style scoped>

</style>
