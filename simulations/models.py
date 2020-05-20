from django.db import models


class Information(models.Model):
    liner_title = models.TextField(max_length=1000, blank=True, default='')

    liner_covered_title = models.TextField(max_length=1000, blank=True, default='')

    square_covered_title = models.TextField(max_length=1000, blank=True, default='')

    lifeless_title = models.TextField(max_length=1000, blank=True, default='')

    quarantine_title = models.TextField(max_length=1000, blank=True, default='')

    down1_title = models.TextField(max_length=1000, blank=True, default='')

    custom_title = models.TextField(max_length=1000, blank=True, default='')

    custom_down_title = models.TextField(max_length=1000, blank=True, default='')

    activity_title = models.TextField(max_length=1000, blank=True, default='')

    resources = models.TextField(max_length=1000, blank=True, default='')

    #upload = models.FileField(upload_to='uploads/')

    def get_data(self):
        return {
            'liner_title': self.liner_title,
            'liner_covered_title': self.liner_covered_title,
            'square_covered_title': self.square_covered_title,
            'lifeless_title': self.lifeless_title,
            'quarantine_title': self.quarantine_title,
            'down1_title': self.down1_title,
            'custom_title': self.custom_title,
            'custom_down_title': self.custom_down_title,
            'activity_title': self.activity_title,
            'resources': self.resources,

        }
