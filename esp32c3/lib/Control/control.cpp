#include <Control.h>

int Control::mode;
int Control::current;
bool Control::showProcess;

int Control::getMode()
{
    return mode;
}

int Control::getCurrent()
{
    return current;
}

bool Control::getShowProcess()
{
    return showProcess;
}

void Control::setMode(int m)
{
    mode = m;
}

void Control::setCurrentByMode()
{
    current = mode;
}

void Control::setCurrentByMode(int m)
{
    current = m;
}

void Control::setNextMode()
{
    mode = (mode + 1) % 3;
}

void Control::setShowProcess(bool sP)
{
    showProcess = sP;
}

void Control::init(int m, bool sP)
{
    if (m > 0 && m < 3)
    {
        Control::mode = m;
    }
    else
    {
        Control::mode = 0;
    }

    Control::showProcess = sP;
    Control::current = 0;
}