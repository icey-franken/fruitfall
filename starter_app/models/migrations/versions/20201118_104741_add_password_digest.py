"""add password digest

Revision ID: 3b3d8fb748bd
Revises: 4e442a229f0a
Create Date: 2020-11-18 10:47:41.072911

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3b3d8fb748bd'
down_revision = '4e442a229f0a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('password_digest', sa.String(length=255), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'password_digest')
    # ### end Alembic commands ###