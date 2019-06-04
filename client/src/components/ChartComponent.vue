<script>
import { Line } from 'vue-chartjs';
import { transactionService } from '@/_services';

export default {
    extends: Line,
    mounted() {
        let Months = new Array();
        let Totals = new Array();
        let transactions = transactionService.getIncomeFromService();
        if(transactions) {
            transactions.forEach(element => {
                Months.push(element._id.month);
                Totals.push(element.totalValue);
            });
            this.renderChart({
                labels: Months,
                datasets: [{
                    label: 'Services',
                    backgroundColor: '#FC2525',
                    data: Totals
                }]
            }, {responsive: true, maintainAspectRatio: false})
        }
        else {
            console.log('No data');
        }           
    }
}
</script>