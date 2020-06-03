# CovidSimulation
 ### There are simulations of Covid-19 distribution:
    1. Simulations of distribution with/withon quarantine
    2. Simulaion of distribution in Moscow
    
-------

### If you want to run application on locallhost:
    1. Thirst of all create your virtualen: 
`virtualenv --python=python3 venv`

    2. Then activate your virtualen
`source venv/bin/activate`

    3. After that you need to install the requirements:
`pip install -r requirements.txt`

    4. Then, run tha application with command (if you are not on django.msu-web.tech you can use any over port): 
`python manage.py runserver 9000`

    or if ypu do not wont to see the logs use
`python manage.py runserver 9000 >> log.log 2>&1`
    
    5. All logs look up in file log.log
--------

###  If you want to look to the working version go to [Cite](https://covid-simulation.herokuapp.com "Cite"). 

### For more details see the Presentation.pdf or Description.pdf

### Permissions:
Only admins can edit site. If you want to login as administrator look up metodata, after that gо [here](https://covid-simulation.herokuapp.com/admin "here") and login.
Remember, only the latest row in the database is displayed on the site.
------
