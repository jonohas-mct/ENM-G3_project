import configparser
from .InfluxDatabase import InfluxDatabase

### GET BUCKET FROM CONFIG ###
config = configparser.ConfigParser()
config.read('Backend\config.ini')
bucket = config['influx']['bucket']


class InfluxRepository:
    ### READ DATA ###
    @staticmethod
    def read_data(measurement, time):
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._measurement == "{measurement}")'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_data_from_device(measurement, time, device):
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._measurement == "{measurement}") |> filter(fn: (r) => r._field == "{device}")'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_watthour_from_device(measurement, time, device, pertime):
        pertime_dict = {'1h': 1, '1d': 24, '1w': 24*7}
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._measurement == "{measurement}") |> filter(fn: (r) => r._field == "{device}") |> truncateTimeColumn(unit: {pertime}) |> group(columns: ["_time"]) |> median() |> map(fn: (r) => ({{ r with _value: r._value * {pertime_dict[pertime]}.0 }}))'
        results = InfluxDatabase.get_data(query)
        return results


# ### TESTING ###
# if __name__ == '__main__':

#     for i in InfluxRepository.read_all_net_year():
#         print(i)
