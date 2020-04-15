from django.shortcuts import render
from django.http import JsonResponse

import pandas as pd
import numpy as np


def send_json(request):
    df = pd.read_csv('/Users/kuand/Desktop/Projects/Covid/covid/applemobilitytrends-2020-04-13.csv')

    driver = df[(df['geo_type'] == 'country/region') & (df['transportation_type'] == 'driving')]

    driver = driver[driver['region'] == 'Russia']
    data = []
    mas = driver.loc[107, '2020-01-13':]
    for i in range(len(mas)):
        data.append({
            'date': mas.index[i],
            'data': str(mas[i]) + '%',
        })

    return JsonResponse(data, safe=False)


def check_notifications(request):
    return render(request, 'main.html')
