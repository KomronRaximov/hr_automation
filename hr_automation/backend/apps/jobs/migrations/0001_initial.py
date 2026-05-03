from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("candidates", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="JobDescription",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField()),
                ("required_skills", models.TextField(blank=True, null=True)),
                ("embedding", models.JSONField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="MatchResult",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("match_score", models.FloatField()),
                ("rank_position", models.PositiveIntegerField(blank=True, null=True)),
                ("explanation", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "job_description",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="jobs.jobdescription"),
                ),
                ("resume", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="candidates.resume")),
            ],
            options={
                "ordering": ["rank_position", "-match_score"],
                "unique_together": {("resume", "job_description")},
            },
        ),
    ]
